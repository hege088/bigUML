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
package com.eclipsesource.uml.modelserver.shared.utils;

import com.eclipsesource.uml.modelserver.core.resource.notation.UmlNotationResource;
import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.unotation.Representation;
import com.eclipsesource.uml.modelserver.unotation.UmlDiagram;

public final class UmlNotationUtil {

   private UmlNotationUtil() {}

   public static final String NOTATION_EXTENSION = "unotation";

   public static Representation getRepresentation(final String representation) {
      return Representation.valueOf(representation.toUpperCase());
   }

   public static UmlDiagram getDiagram(final ModelContext context) {
      var notationResource = context.domain.getResourceSet()
         .getResource(context.uri.trimFileExtension().appendFileExtension(UmlNotationResource.FILE_EXTENSION), false);
      var notationRoot = notationResource.getContents().get(0);

      return (UmlDiagram) notationRoot;
   }

}
