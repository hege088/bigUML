/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { DiagramWidget, GLSPDiagramWidget } from '@eclipse-glsp/theia-integration';
import { DisposableCollection } from '@theia/core';
import { FrontendApplication, FrontendApplicationContribution } from '@theia/core/lib/browser/frontend-application';
import { AbstractViewContribution } from '@theia/core/lib/browser/shell/view-contribution';
import { OS } from '@theia/core/lib/common/os';
import { inject, injectable } from '@theia/core/shared/inversify';
import { EditorManager } from '@theia/editor/lib/browser';

import { IChangedArgs, UTDiagramManager } from '../../../glsp/diagram/ut-diagram.manager';
import { OutlineIntegrationManager } from '../integration/index';
import { OutlineWidgetService } from './outline-widget.service';
import { OutlineWidget } from './outline-widget.widget';

export const DIAGRAM_OUTLINE_VIEW_WIDGET_FACTORY_ID = 'diagram-outline-view';

@injectable()
export class OutlineWidgetContribution extends AbstractViewContribution<OutlineWidget> implements FrontendApplicationContribution {
    protected readonly toDisposeOnClose = new DisposableCollection();
    protected readonly toDisposeOnEditor = new DisposableCollection();
    protected canUpdateOutline = true;

    @inject(OutlineWidgetService)
    protected readonly outlineWidgetService: OutlineWidgetService;

    @inject(OutlineIntegrationManager)
    protected readonly outlineIntegrationManager: OutlineIntegrationManager;

    @inject(UTDiagramManager)
    protected readonly diagramManager: UTDiagramManager;
    @inject(EditorManager)
    protected readonly editorManager: EditorManager;

    constructor() {
        super({
            widgetId: DIAGRAM_OUTLINE_VIEW_WIDGET_FACTORY_ID,
            widgetName: OutlineWidget.LABEL,
            defaultWidgetOptions: {
                area: 'right',
                rank: 500
            },
            toggleCommandId: 'diagramOutlineView:toggle',
            toggleKeybinding: OS.type() !== OS.Type.Linux ? 'ctrlcmd+shift+o' : undefined
        });
    }

    onStart(app: FrontendApplication): void {
        this.diagramManager.onCurrentEditorChanged(event => {
            this.handleEditorChanged(event);
        });

        this.outlineWidgetService.onDidChangeOpenState(async open => {
            const currentEditor = this.diagramManager.currentEditor;

            if (open) {
                if (currentEditor instanceof GLSPDiagramWidget) {
                    this.outlineIntegrationManager.refresh(currentEditor);
                } else {
                    this.outlineWidgetService.publish([]);
                }
            }
        });
    }

    protected handleEditorChanged(event: IChangedArgs<DiagramWidget>): void {
        if (event.newValue instanceof GLSPDiagramWidget) {
            this.outlineIntegrationManager.refresh(event.newValue);
        } else if (event.oldValue instanceof GLSPDiagramWidget) {
            this.outlineIntegrationManager.clear();
        }
    }

    async initializeLayout(app: FrontendApplication): Promise<void> {
        await this.openView();
    }
}
