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
package com.eclipsesource.uml.glsp.uml.communication_diagram.gmodel;

import java.util.ArrayList;

import org.eclipse.glsp.graph.GEdge;
import org.eclipse.glsp.graph.GLabel;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.glsp.graph.builder.impl.GEdgeBuilder;
import org.eclipse.glsp.graph.builder.impl.GEdgePlacementBuilder;
import org.eclipse.glsp.graph.builder.impl.GLabelBuilder;
import org.eclipse.glsp.graph.util.GConstants;
import org.eclipse.glsp.graph.util.GraphUtil;
import org.eclipse.uml2.uml.Message;
import org.eclipse.uml2.uml.MessageOccurrenceSpecification;

import com.eclipsesource.uml.glsp.gmodel.AbstractGModelFactory;
import com.eclipsesource.uml.glsp.model.UmlModelState;
import com.eclipsesource.uml.glsp.util.UmlConfig.CSS;
import com.eclipsesource.uml.glsp.util.UmlConfig.Types;
import com.eclipsesource.uml.glsp.util.UmlIDUtil;
import com.eclipsesource.uml.modelserver.unotation.Edge;

public class CommunicationMessageEdgeFactory extends AbstractGModelFactory<Message, GEdge> {

   public CommunicationMessageEdgeFactory(final UmlModelState modelState) {
      super(modelState);
   }

   @Override
   public GEdge create(final Message message) {
      var sendEvent = (MessageOccurrenceSpecification) message.getSendEvent();
      var receiveEvent = (MessageOccurrenceSpecification) message.getReceiveEvent();

      var source = sendEvent.getCovered();
      var target = receiveEvent.getCovered();

      GEdgeBuilder builder = new GEdgeBuilder(Types.MESSAGE)
         .id(toId(message))
         .addCssClass(CSS.EDGE)
         .sourceId(toId(source))
         .targetId(toId(target))
         .routerKind(GConstants.RouterKind.MANHATTAN);

      GLabel nameLabel = createEdgeNameLabel(message.getName(), UmlIDUtil.createLabelNameId(toId(message)), 0.6d);
      builder.add(nameLabel);

      modelState.getIndex().getNotation(message, Edge.class).ifPresent(edge -> {
         if (edge.getBendPoints() != null) {
            ArrayList<GPoint> bendPoints = new ArrayList<>();
            edge.getBendPoints().forEach(p -> bendPoints.add(GraphUtil.copy(p)));
            builder.addRoutingPoints(bendPoints);
         }
      });
      return builder.build();
   }

   protected GLabel createEdgeNameLabel(final String name, final String id, final double position) {
      return createEdgeLabel(name, position, id, Types.MESSAGE_LABEL_ARROW_EDGE_NAME, GConstants.EdgeSide.TOP);
   }

   protected GLabel createEdgeLabel(final String name, final double position, final String id, final String type,
      final String side) {
      return new GLabelBuilder(type)
         .edgePlacement(new GEdgePlacementBuilder()
            .side(side)
            .position(position)
            .rotate(false)
            .build())
         .id(id)
         .text(name).build();
   }

}