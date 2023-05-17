/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { injectable } from 'inversify';
import { VSCodeCommand } from '../vscode/command/command';
import {writeExtensionPermissionsForLiveshare} from '@eclipse-glsp/vscode-integration';

@injectable()
export class InitLiveshareConfigCommand implements VSCodeCommand {
    constructor() {}

    get id(): string {
        return 'bigUML.liveshare.init';
    }

    execute(): void {
        writeExtensionPermissionsForLiveshare('BIGModelingTools', true);
    }
}
