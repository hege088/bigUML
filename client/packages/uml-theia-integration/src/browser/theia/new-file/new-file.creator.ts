/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { UmlDiagramTypeUtil } from '@borkdominik-biguml/uml-common';
import { CommandService, QuickInputService } from '@theia/core';
import { OpenerService } from '@theia/core/lib/browser/opener-service';
import { URI as TheiaURI } from '@theia/core/lib/common/uri';
import { FileNavigatorCommands } from '@theia/navigator/lib/browser/file-navigator-commands';
import { WorkspaceService } from '@theia/workspace/lib/browser';
import { inject, injectable } from 'inversify';
import URI from 'urijs';
import { UTLanguageEnvironment } from '../../../common/language';
import { UTModelServerClient } from '../../../common/modelserver.client';

@injectable()
export class NewFileCreator {
    @inject(UTModelServerClient)
    protected readonly modelServerClient: UTModelServerClient;
    @inject(QuickInputService)
    protected readonly quickInputService: QuickInputService;
    @inject(WorkspaceService)
    protected readonly workspaceService: WorkspaceService;
    @inject(CommandService) protected readonly commandService: CommandService;
    @inject(OpenerService) protected readonly openerService: OpenerService;

    async create(): Promise<void> {
        if (this.workspaceService.tryGetRoots().length > 0) {
            const workspaceUri = this.workspaceService.tryGetRoots()[0].resource;

            const diagramName = await this.showInput('Diagram name', 'Enter name of UML diagram', async input =>
                input ? undefined : 'Diagram name can not be empty'
            );

            if (diagramName !== undefined) {
                const diagramType = await this.showInput(
                    UTLanguageEnvironment.supportedTypes.map(t => t.toLowerCase()).join(' | '),
                    'Enter UML diagram type',
                    async input =>
                        UTLanguageEnvironment.supportedTypes.includes(UmlDiagramTypeUtil.parseString(input))
                            ? undefined
                            : `${input} is not a valid value`
                );

                if (diagramType !== undefined) {
                    this.createUmlDiagram(diagramName, workspaceUri.path.toString(), diagramType);
                }
            }
        }
    }

    protected async showInput(
        placeHolder: string,
        hint: string,
        inputCheck?: (input: string) => Promise<string | undefined>
    ): Promise<string | undefined> {
        return this.quickInputService.input({
            prompt: hint,
            placeHolder: placeHolder,
            validateInput: async input => {
                if (inputCheck) {
                    return inputCheck(input);
                }
                return !input ? 'Please enter a valid string' : undefined;
            }
        });
    }

    protected createUmlDiagram(diagramName: string, workspaceUri: string, diagramType: string): void {
        const uri = workspaceUri + `/${diagramName}/model/${diagramName}.uml`;
        const theiaUri = new TheiaURI(uri);
        const uriJs = new URI(uri);

        this.modelServerClient
            .create(
                uriJs,
                {
                    data: {
                        $type: 'com.eclipsesource.uml.modelserver.model.impl.NewDiagramRequestImpl',
                        diagramType
                    }
                },
                undefined as any,
                'raw-json'
            )
            .then(async () => {
                this.quickInputService.hide();
                this.commandService.executeCommand(FileNavigatorCommands.REFRESH_NAVIGATOR.id);
                const openHandler = await this.openerService.getOpener(theiaUri);
                openHandler.open(theiaUri);
                this.commandService.executeCommand(FileNavigatorCommands.REVEAL_IN_NAVIGATOR.id);
            });
    }
}
