/********************************************************************************
 * Copyright (c) 2023 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.features.property_palette.model;

import java.util.List;

import org.eclipse.glsp.server.actions.Action;

public final class ElementReferencePropertyItem extends ElementPropertyItem {

   public final String label;
   public final List<Reference> references;
   public final List<CreateReference> creates;
   public final Boolean isOrderable;

   public ElementReferencePropertyItem(final String elementId, final String propertyId, final String label,
      final List<Reference> references, final List<CreateReference> creates, final Boolean isOrderable) {
      super(elementId, propertyId, ElementPropertyType.REFERENCE);

      this.label = label;
      this.references = references;
      this.creates = creates;
      this.isOrderable = isOrderable;
   }

   public static class Reference {
      public final String label;
      public final String elementId;
      public final Boolean isReadonly;

      public Reference(final String label, final String elementId) {
         this(label, elementId, true);
      }

      public Reference(final String label, final String elementId, final Boolean isReadonly) {
         super();
         this.label = label;
         this.elementId = elementId;
         this.isReadonly = isReadonly;
      }
   }

   public static class CreateReference {
      public final String label;
      public final Action action;

      public CreateReference(final String label, final Action action) {
         super();
         this.label = label;
         this.action = action;
      }
   }
}
