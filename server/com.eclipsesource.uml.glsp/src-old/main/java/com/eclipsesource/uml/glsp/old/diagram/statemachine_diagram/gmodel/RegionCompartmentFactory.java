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
package com.eclipsesource.uml.glsp.old.diagram.statemachine_diagram.gmodel;

public class RegionCompartmentFactory { /*-

   private final StateMachineDiagramFactory parentFactory;

   public RegionCompartmentFactory(final UmlModelState modelState, final StateMachineDiagramFactory parentFactory) {
      super(modelState);
      this.parentFactory = parentFactory;
   }

   @Override
   public GCompartment create(final Region region) {
      return createChildrenCompartment(region.getSubvertices(), region, region.getTransitions());
   }

   protected void applyShapeData(final Region region, final GCompartmentBuilder builder) {
      modelState.getIndex().getNotation(region, Shape.class).ifPresent(shape -> {
         if (shape.getPosition() != null) {
            builder.position(GraphUtil.copy(shape.getPosition()));
         } else if (shape.getSize() != null) {
            builder.size(GraphUtil.copy(shape.getSize()));
         }
      });
   }

   protected GCompartment createChildrenCompartment(final Collection<Vertex> children,
      final Region parent, final Collection<Transition> edges) {
      return new GCompartmentBuilder(Types.COMP)
         .id(toId(parent) + "_childCompartment").layout(GConstants.Layout.VBOX)
         .layoutOptions(new GLayoutOptions()
            .hAlign(GConstants.HAlign.LEFT)
            .resizeContainer(true))
         .addAll(children.stream()
            .map(parentFactory::create)
            .collect(Collectors.toList()))
         .addAll(edges.stream()
            .map(parentFactory::create)
            .collect(Collectors.toList()))
         .build();
   }
   */
}
