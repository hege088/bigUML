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
package com.eclipsesource.uml.glsp.uml.diagram.communication_diagram.constants;

import org.eclipse.glsp.graph.DefaultTypes;

import com.eclipsesource.uml.glsp.core.constants.CoreTypes;

public class UmlCommunication_Interaction {

   public static final String ID = "interaction";
   public static final String ICON = CoreTypes.ICON + ":" + ID;
   public static final String TYPE_ID = DefaultTypes.NODE + ":" + ID;

   public class Property {

      public static final String NAME = "name";

      private Property() {}
   }

   private UmlCommunication_Interaction() {}
}
