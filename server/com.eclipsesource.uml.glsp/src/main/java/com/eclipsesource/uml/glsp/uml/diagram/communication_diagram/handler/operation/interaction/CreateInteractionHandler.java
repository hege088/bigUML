/********************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.uml.diagram.communication_diagram.handler.operation.interaction;

import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.glsp.server.operations.CreateNodeOperation;
import org.eclipse.uml2.uml.Model;

import com.eclipsesource.uml.glsp.uml.diagram.communication_diagram.constants.UmlCommunication_Interaction;
import com.eclipsesource.uml.glsp.uml.handler.operations.create.BaseCreateChildNodeHandler;
import com.eclipsesource.uml.glsp.uml.handler.operations.create.CreateLocationAwareNodeHandler;
import com.eclipsesource.uml.modelserver.uml.diagram.communication_diagram.commands.interaction.CreateInteractionContribution;

public final class CreateInteractionHandler
   extends BaseCreateChildNodeHandler<Model> implements CreateLocationAwareNodeHandler {

   public CreateInteractionHandler() {
      super(UmlCommunication_Interaction.TYPE_ID);
   }

   @Override
   protected CCommand createCommand(final CreateNodeOperation operation, final Model parent) {
      return CreateInteractionContribution.create(
         parent,
         relativeLocationOf(modelState, operation).orElse(GraphUtil.point(0, 0)));
   }
}
