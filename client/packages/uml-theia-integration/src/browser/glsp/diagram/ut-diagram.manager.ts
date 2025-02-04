/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { configureServerActions } from '@eclipse-glsp/client';
import { DiagramWidget, GLSPDiagramManager, GLSPWidgetOpenerOptions, GLSPWidgetOptions } from '@eclipse-glsp/theia-integration/lib/browser';
import { Emitter, Event, SelectionService } from '@theia/core';
import { Widget } from '@theia/core/lib/browser';
import URI from '@theia/core/lib/common/uri';
import { WorkspaceService } from '@theia/workspace/lib/browser';
import { inject, injectable, postConstruct } from 'inversify';
import { DiagramWidgetOptions } from 'sprotty-theia';

import { UTDiagramLanguage } from '../../../common/language';
import { UTDiagramWidget } from './ut-diagram.widget';

export interface UTDiagramWidgetOptions extends DiagramWidgetOptions, GLSPWidgetOptions {
    workspaceRoot: string;
}
export interface IChangedArgs<T extends Widget> {
    oldValue: T | undefined;
    newValue: T | undefined;
}

@injectable()
export class UTDiagramManager extends GLSPDiagramManager {
    private workspaceRoot: string;

    @inject(SelectionService) protected readonly selectionService: SelectionService;
    @inject(WorkspaceService) protected readonly workspaceService: WorkspaceService;

    protected readonly recentlyVisibleIds: string[] = [];
    protected readonly onCurrentEditorChangedEmitter = new Emitter<IChangedArgs<DiagramWidget>>();
    protected _currentEditor: DiagramWidget | undefined;

    protected get recentlyVisible(): DiagramWidget | undefined {
        const id = this.recentlyVisibleIds[0];
        return (id && this.all.find(w => w.id === id)) || undefined;
    }

    readonly diagramType = UTDiagramLanguage.diagramType;
    readonly label = UTDiagramLanguage.label + ' Editor';

    get currentEditor(): DiagramWidget | undefined {
        return this._currentEditor;
    }

    get fileExtensions(): string[] {
        return UTDiagramLanguage.fileExtensions;
    }

    override get iconClass(): string {
        return UTDiagramLanguage.iconClass!;
    }

    get onCurrentEditorChanged(): Event<IChangedArgs<DiagramWidget>> {
        return this.onCurrentEditorChangedEmitter.event;
    }

    @postConstruct()
    protected override async initialize(): Promise<void> {
        super.init();
        super.initialize();

        this.workspaceService.roots.then(roots => (this.workspaceRoot = roots[0].resource.toString()));

        // Necessary for editor switches
        this.shell.onDidChangeCurrentWidget(() => {
            this.updateCurrentEditor();
        });

        this.onCreated(widget => {
            widget.onDidChangeVisibility(() => {
                if (widget.isVisible) {
                    this.addRecentlyVisible(widget);
                    this.updateCurrentEditor(widget);
                } else {
                    this.updateCurrentEditor();
                }
            });

            widget.disposed.connect(() => {
                this.removeRecentlyVisible(widget);
                this.updateCurrentEditor();
            });
        });

        for (const widget of this.all) {
            if (widget.isVisible) {
                this.addRecentlyVisible(widget);
            }
        }
        this.updateCurrentEditor();
    }

    protected setCurrentEditor(current: DiagramWidget | undefined): void {
        if (this._currentEditor !== current) {
            const oldValue = this._currentEditor;
            this._currentEditor = current;
            this.onCurrentEditorChangedEmitter.fire({
                oldValue,
                newValue: this._currentEditor
            });
        }
    }

    protected updateCurrentEditor(currentWidget?: DiagramWidget): void {
        const widget = currentWidget ?? this.shell.currentWidget;

        if (widget instanceof DiagramWidget) {
            this.setCurrentEditor(widget);
        } else if (!this._currentEditor?.isVisible) {
            this.setCurrentEditor(undefined);
        } else if (!this._currentEditor || !this._currentEditor.isVisible || this.currentEditor !== this.recentlyVisible) {
            this.setCurrentEditor(this.recentlyVisible);
        }
    }

    protected addRecentlyVisible(widget: DiagramWidget): void {
        this.removeRecentlyVisible(widget);
        this.recentlyVisibleIds.unshift(widget.id);
    }

    protected removeRecentlyVisible(widget: DiagramWidget): void {
        const index = this.recentlyVisibleIds.indexOf(widget.id);
        if (index !== -1) {
            this.recentlyVisibleIds.splice(index, 1);
        }
    }

    protected override createWidgetOptions(uri: URI, options?: GLSPWidgetOpenerOptions): UTDiagramWidgetOptions {
        return {
            ...super.createWidgetOptions(uri, options),
            workspaceRoot: this.workspaceRoot
        } as UTDiagramWidgetOptions;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    override async createWidget(options?: any): Promise<DiagramWidget> {
        if (DiagramWidgetOptions.is(options)) {
            const clientId = this.createClientId();
            const widgetId = this.createWidgetId(options);
            const config = this.getDiagramConfiguration(options);
            const diContainer = config.createContainer(clientId);
            const initializeResult = await this.diagramConnector.initializeResult;
            await configureServerActions(initializeResult, this.diagramType, diContainer);
            const widget = new UTDiagramWidget(
                options,
                widgetId,
                diContainer,
                this.editorPreferences,
                this.storage,
                this.theiaSelectionService,
                this.diagramConnector
            );
            widget.listenToFocusState(this.shell);
            return widget;
        }
        throw Error('DiagramWidgetFactory needs DiagramWidgetOptions but got ' + JSON.stringify(options));
    }
}

export function belongsToDiagramWidget(widget: DiagramWidget | undefined, clientId: string): widget is DiagramWidget {
    return widget !== undefined && widget.widgetId === clientId;
}
