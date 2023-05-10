/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { ModelServerConfig } from '@borkdominik-biguml/uml-modelserver/lib/config';
import { UmlModelServerClient } from '@borkdominik-biguml/uml-modelserver/lib/modelserver.client';
import { AnyObject, TypeGuard } from '@eclipse-emfcloud/modelserver-client';
import { Format } from 'esbuild';
import { inject, injectable } from 'inversify';
import URI from 'urijs';
import * as vscode from 'vscode';
import { TYPES } from '../di.types';
import { isInVslsWorkspace } from '../liveshare/liveshare-util';
import { ServerManager, ServerManagerStateListener } from '../server/server.manager';
import { OutputChannel } from '../vscode/output/output.channel';

@injectable()
export class UVModelServerClient extends UmlModelServerClient implements ServerManagerStateListener {
    constructor(
        @inject(TYPES.OutputChannel) protected readonly output: OutputChannel,
        @inject(TYPES.ModelServerConfig) protected override readonly config: ModelServerConfig
    ) {
        super(config);
    }

    serverManagerStateChanged(_manager: ServerManager, state: ServerManager.State): void {
        if (state.state === 'servers-launched') {
            this.setUpModelServer();
        }
    }

    override create<M>(
        modeluri: URI,
        model: AnyObject | string,
        formatOrGuard?: FormatOrGuard<M>,
        format?: Format
    ): Promise<AnyObject | M> {
        if (isInVslsWorkspace()) {
            const errMessage = 'Creating Models is not allowed as a Guest in Liveshare.';
            vscode.window.showErrorMessage(errMessage);
            throw new Error(errMessage); // TODO implement collaboration for ModelServerClient
        }
        return super.create(modeluri, model, formatOrGuard, format);
    }

    override delete(modeluri: URI): Promise<boolean> {
        if (isInVslsWorkspace()) {
            const errMessage = 'Deleting Models is not allowed as a Guest in Liveshare.';
            vscode.window.showErrorMessage(errMessage);
            throw new Error(errMessage); // TODO implement collaboration for ModelServerClient
        }
        return super.delete(modeluri);
    }

    protected async setUpModelServer(): Promise<void> {
        if (isInVslsWorkspace()) {
            return; // TODO implement collaboration for ModelServerClient
        }
        const workspaces = vscode.workspace.workspaceFolders;
        if (workspaces && workspaces.length > 0) {
            const workspaceRoot = new URI(workspaces[0].uri.toString());
            const uiSchemaFolder = workspaceRoot.clone().segment('.ui-schemas');

            try {
                if (
                    !(await this.configureServer({
                        workspaceRoot,
                        uiSchemaFolder
                    }))
                ) {
                    vscode.window.showErrorMessage('Configuration of ModelServer failed.');
                }
            } catch (error: any) {
                console.error(error);

                if (error instanceof Error) {
                    const e = error;
                    this.output.error(e);
                    vscode.window.showErrorMessage('Configuration of ModelServer failed.', 'Details').then(value => {
                        if (value === 'Details') {
                            vscode.window.showErrorMessage(e.message, {
                                modal: true,
                                detail: e.stack ?? e.message
                            });
                        }
                    });
                }
            }
        }
    }
}

type FormatOrGuard<M> = Format | TypeGuard<M>;
