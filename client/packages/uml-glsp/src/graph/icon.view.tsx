/*********************************************************************************
 * Copyright (c) 2023 borkdominik and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the MIT License which is available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: MIT
 *********************************************************************************/
import { IView, RenderingContext, svg } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { VNode } from 'snabbdom';

import { Icon, IconCSS } from './icon.model';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const JSX = { createElement: svg };

@injectable()
export class IconView implements IView {
    render(element: Icon, context: RenderingContext): VNode {
        let image;
        if (element.iconImageName) {
            image = require('../../resources/images/' + element.iconImageName);
        }

        const iconView: any = (
            <g>
                <image class-sprotty-icon={true} href={image} x={-2} y={-1} width={20} height={20}></image>
                {context.renderChildren(element)}
            </g>
        );
        return iconView;
    }
}

@injectable()
export class IconCSSView implements IView {
    render(element: IconCSS, context: RenderingContext): VNode {
        let image;

        const propertyArg = element.args['property'];
        if (propertyArg !== undefined) {
            const property = window.getComputedStyle(document.body).getPropertyValue(propertyArg.toLocaleString());
            const url = property.match(/url\(([^)]+)\)/i)![1].replace(/\\/g, '');
            image = url;
        }

        const iconView: any = (
            <g>
                <image class-sprotty-icon={true} href={image} x={-2} y={-1} width={20} height={20}></image>
                {context.renderChildren(element)}
            </g>
        );
        return iconView;
    }
}
