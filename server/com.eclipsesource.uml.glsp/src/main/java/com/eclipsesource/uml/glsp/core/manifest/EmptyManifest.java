/********************************************************************************
 * Copyright (c) 2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.core.manifest;

import com.eclipsesource.uml.glsp.core.manifest.contributions.ActionHandlerContribution;
import com.eclipsesource.uml.glsp.core.manifest.contributions.ClientActionContribution;
import com.eclipsesource.uml.glsp.core.manifest.contributions.CreateHandlerContribution;
import com.eclipsesource.uml.glsp.core.manifest.contributions.DeleteHandlerContribution;
import com.eclipsesource.uml.glsp.core.manifest.contributions.DiagramConfigurationContribution;
import com.eclipsesource.uml.glsp.core.manifest.contributions.GModelMapperContribution;
import com.eclipsesource.uml.glsp.core.manifest.contributions.LabelEditHandlerContribution;
import com.eclipsesource.uml.glsp.core.manifest.contributions.OperationHandlerContribution;
import com.eclipsesource.uml.glsp.core.manifest.contributions.OverrideOperationHandlerContribution;
import com.eclipsesource.uml.glsp.core.manifest.contributions.PaletteContribution;
import com.google.inject.AbstractModule;

public class EmptyManifest extends AbstractModule
   implements ActionHandlerContribution.Creator, ClientActionContribution.Creator, CreateHandlerContribution.Creator,
   DeleteHandlerContribution.Creator,
   DiagramConfigurationContribution.Creator, GModelMapperContribution.Creator, LabelEditHandlerContribution.Creator,
   OperationHandlerContribution.Creator, OverrideOperationHandlerContribution.Creator, PaletteContribution.Creator {

   @Override
   protected void configure() {
      super.configure();
      createActionHandlerBinding(binder());
      createClientActionBinding(binder());
      createCreateHandlerBinding(binder());
      createDiagramCreateHandlerBinding(binder());
      createDeleteHandlerBinding(binder());
      createDiagramDeleteHandlerBinding(binder());
      createDiagramConfigurationBinding(binder());
      createGModelMapperBinding(binder());
      createDiagramGModelMapperBinding(binder());
      createLabelEditHandlerBinding(binder());
      createDiagramLabelEditHandlerBinding(binder());
      createOperationHandlerBinding(binder());
      createOverrideOperationHandlerBinding(binder());
      createDiagramOverrideOperationHandlerBinding(binder());
      createPaletteBinding(binder());
      createDiagramPaletteBinding(binder());
   }

   @Override
   public String id() {
      return getClass().getSimpleName();
   }
}