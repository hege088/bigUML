/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import {
    Action,
    ActionMessage,
    Args, CollaborationAction, getRelativeDocumentUri,
    GlspVscodeClient,
    GlspVscodeConnector,
    GlspVscodeServer,
    InitializeResult,
    MessageOrigin,
    MessageProcessingResult,
    RedoAction,
    SetDirtyStateAction,
    UndoAction
} from '@eclipse-glsp/vscode-integration';
import { inject, injectable } from 'inversify';
import * as vscode from 'vscode';
import { TYPES } from '../di.types';

@injectable()
export class UVGlspConnector<TDocument extends vscode.CustomDocument = vscode.CustomDocument> extends GlspVscodeConnector<TDocument> {
    get documents(): TDocument[] {
        return Array.from(this.documentMap.keys());
    }

    constructor(@inject(TYPES.GlspServer) glspServer: GlspVscodeServer) {
        super({
            server: glspServer,
            logging: false
        });
    }

    clientIdByDocument(document: TDocument): string | undefined {
        return this.documentMap.get(document);
    }

    public override async registerClient(client: GlspVscodeClient<TDocument>): Promise<InitializeResult> {
        this.clientMap.set(client.clientId, client);
        this.documentMap.set(client.document, client.clientId);

        const relativeDocumentUri = getRelativeDocumentUri(client.document.uri.path);

        const clientMessageListener = client.onClientMessage(message => {
            this.onClientMessage(client, message, relativeDocumentUri);
        });

        const viewStateListener = client.webviewPanel.onDidChangeViewState(e => {
            this.onClientViewStateChange(client, e);
        });

        const panelOnDisposeListener = client.webviewPanel.onDidDispose(() => {
            this.onClientDispose(client, [clientMessageListener, viewStateListener, panelOnDisposeListener], relativeDocumentUri);
        });

        // Initialize client session
        const glspClient = await this.options.server.glspClient;
        const initializeParams = await this.createInitializeClientSessionParams(client, relativeDocumentUri);
        await glspClient.initializeClientSession(initializeParams);
        return this.options.server.initializeResult;
    }

    public broadcastActionToClients(action: Action): void {
        this.clientMap.forEach(client => {
            client.onSendToClientEmitter.fire({
                clientId: client.clientId,
                action: action,
                __localDispatch: true
            });
        });
    }

    public override sendActionToClient(clientId: string, action: Action): void {
        super.sendActionToClient(clientId, action);
    }

    protected override handleSetDirtyStateAction(
        message: ActionMessage<SetDirtyStateAction>,
        client: GlspVscodeClient<TDocument> | undefined,
        _origin: MessageOrigin
    ): MessageProcessingResult {
        if (client) {
            const reason = message.action.reason || '';
            if (reason === 'save') {
                this.onDocumentSavedEmitter.fire(client.document);
            } else if (message.action.isDirty && message.action.reason === 'operation') {
                this.onDidChangeCustomDocumentEventEmitter.fire({
                    document: client.document,
                    undo: () => {
                        this.sendActionToClient(client.clientId, UndoAction.create());
                    },
                    redo: () => {
                        this.sendActionToClient(client.clientId, RedoAction.create());
                    }
                });
            }
        }

        return { processedMessage: message, messageChanged: false };
        // TODO: Check why
        // The webview client cannot handle `SetDirtyStateAction`s. Avoid propagation
        // return { processedMessage: GlspVscodeConnector.NO_PROPAGATION_MESSAGE, messageChanged: true };
    }

    protected onClientMessage(client: GlspVscodeClient<TDocument>, message: unknown, relativeDocumentUri: string): void {
        if (this.options.logging) {
            if (ActionMessage.is(message)) {
                // don't log CollaborationActions
                if (!CollaborationAction.is(message.action)) {
                    console.log(`Client (${message.clientId}): ${message.action.kind}`, message.action);
                }
            } else {
                console.log('Client (no action message):', message);
            }
        }

        // Run message through first user-provided interceptor (pre-receive)
        this.options.onBeforeReceiveMessageFromClient(message, (newMessage, shouldBeProcessedByConnector = true) => {
            const { processedMessage, messageChanged } = shouldBeProcessedByConnector
                ? this.processMessage(newMessage, MessageOrigin.CLIENT)
                : { processedMessage: message, messageChanged: false };

            const filteredMessage = this.options.onBeforePropagateMessageToServer(newMessage, processedMessage, messageChanged);

            if (typeof filteredMessage !== 'undefined') {
                if (ActionMessage.is(filteredMessage)) {
                    filteredMessage.args = {
                        ...filteredMessage.args,
                        relativeDocumentUri
                    }
                }
                this.options.server.onSendToServerEmitter.fire(filteredMessage);
            }
        });
    }

    protected onClientViewStateChange(client: GlspVscodeClient<TDocument>, event: vscode.WebviewPanelOnDidChangeViewStateEvent): void {
        if (event.webviewPanel.active) {
            this.selectionUpdateEmitter.fire(this.clientSelectionMap.get(client.clientId) || []);
        }
    }

    protected onClientDispose(client: GlspVscodeClient<TDocument>, disposables: vscode.Disposable[], relativeDocumentUri: string): void {
        this.diagnostics.set(client.document.uri, undefined); // this clears the diagnostics for the file
        this.clientMap.delete(client.clientId);
        this.documentMap.delete(client.document);
        this.clientSelectionMap.delete(client.clientId);

        this.options.server.glspClient.then(gc => {
            gc.disposeClientSession({
                clientSessionId: client.clientId,
                args: this.disposeClientSessionArgs(client, relativeDocumentUri)
            });
        });

        disposables.forEach(d => d.dispose());
    }

    protected disposeClientSessionArgs(client: GlspVscodeClient<TDocument>, relativeDocumentUri: string): Args | undefined {
        return {
            ['sourceUri']: client.document.uri.path,
            ['relativeDocumentUri']: relativeDocumentUri
        };
    }
}
