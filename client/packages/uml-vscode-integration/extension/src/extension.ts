/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import '../css/colors.css';

import { Container } from 'inversify';
import * as vscode from 'vscode';
import { createContainer } from './di.config';
import { TYPES } from './di.types';
import { UVGlspConnector } from './glsp/uv-glsp-connector';
import { UVGlspServer } from './glsp/uv-glsp-server';
import { VSCodeSettings } from './language';
import { createGLSPServerConfig, createModelServerConfig, ServerManager } from './server';
import { configureDefaultCommands } from './vscode/command/default-commands';
import {configureCollaborationCommands} from '@eclipse-glsp/vscode-integration';

let diContainer: Container | undefined;

export async function activate(context: vscode.ExtensionContext): Promise<void> {
    const glspServerConfig = await createGLSPServerConfig();
    const modelServerConfig = await createModelServerConfig();

    diContainer = createContainer(context, {
        glspServerConfig,
        modelServerConfig
    });

    const connector = diContainer.get<UVGlspConnector>(TYPES.Connector);

    configureDefaultCommands({
        extensionContext: context,
        connector,
        diagramPrefix: VSCodeSettings.commands.prefix
    });

    configureCollaborationCommands({
        extensionContext: context,
        connector
    });

    diContainer.getAll<any>(TYPES.RootInitialization);
    await diContainer.get<ServerManager>(TYPES.ServerManager).start();
    diContainer.get<UVGlspServer>(TYPES.GlspServer).start();
}

export async function deactivate(context: vscode.ExtensionContext): Promise<any> {
    if (diContainer) {
        return Promise.all([diContainer.get<ServerManager>(TYPES.ServerManager).stop()]);
    }
}
