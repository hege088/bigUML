/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { UmlDiagramTypeUtil, UmlLanguageEnvironment } from '@borkdominik-biguml/uml-common';

export const UVLangugageEnvironment: UmlLanguageEnvironment = {
    supportedTypes: UmlDiagramTypeUtil.supported
};

export const VSCodeSettings = {
    name: 'bigUML',
    commands: {
        prefix: 'bigUML'
    },
    editor: {
        extension: 'uml',
        viewType: 'bigUML.diagramView'
    }
} as const;
