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
package com.eclipsesource.uml.glsp.uml.diagram.class_diagram.handler.operation.association;

import java.util.List;

import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.glsp.server.operations.CreateEdgeOperation;
import org.eclipse.uml2.uml.Type;

import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.UmlClass_AbstractClass;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.UmlClass_Association;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.UmlClass_Class;
import com.eclipsesource.uml.glsp.uml.diagram.class_diagram.constants.UmlClass_Interface;
import com.eclipsesource.uml.glsp.uml.handler.operations.create.BaseCreateEdgeBetweenNodesHandler;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.association.CreateAssociationContribution;
import com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.constants.AssociationType;

public final class CreateAggregationHandler
   extends BaseCreateEdgeBetweenNodesHandler<Type, Type> {

   public CreateAggregationHandler() {
      super(UmlClass_Association.AGGREGATION_TYPE_ID);
   }

   @Override
   protected List<String> sources() {
      return List.of(UmlClass_AbstractClass.TYPE_ID, UmlClass_Class.TYPE_ID, UmlClass_Interface.TYPE_ID);
   }

   @Override
   protected List<String> targets() {
      return List.of(UmlClass_AbstractClass.TYPE_ID, UmlClass_Class.TYPE_ID, UmlClass_Interface.TYPE_ID);
   }

   @Override
   protected CCommand createCommand(final CreateEdgeOperation operation, final Type source, final Type target) {
      var keyword = AssociationType.AGGREGATION;
      return CreateAssociationContribution
         .create(source, target, keyword);

   }

}