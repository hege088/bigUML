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
package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.uclass;

import org.eclipse.uml2.uml.Class;
import org.eclipse.uml2.uml.Package;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.BaseDeleteSemanticChildCommand;

public final class DeleteClassSemanticCommand extends BaseDeleteSemanticChildCommand<Package, Class> {

   public DeleteClassSemanticCommand(final ModelContext context, final Class semanticElement) {
      super(context, semanticElement.getPackage(), semanticElement);
   }

   @Override
   protected void deleteSemanticElement(final Package parent, final Class child) {
      parent.getPackagedElements().remove(child);
   }
}
