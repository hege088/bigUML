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
package com.eclipsesource.uml.modelserver.old.diagram.common.contributions;

public class ChangeBoundsCommandContribution {
   /*-
   public static final String TYPE = "changeBounds";
   
   public static CCommand create(final String semanticUri, final GPoint position, final GDimension size) {
      CCommand changeBoundsCommand = CCommandFactory.eINSTANCE.createCommand();
      changeBoundsCommand.setType(TYPE);
      changeBoundsCommand.getProperties().put(SEMANTIC_PROXI_URI, semanticUri);
      changeBoundsCommand.getProperties().put(POSITION_X, String.valueOf(position.getX()));
      changeBoundsCommand.getProperties().put(POSITION_Y, String.valueOf(position.getY()));
      changeBoundsCommand.getProperties().put(WIDTH, String.valueOf(size.getHeight()));
      changeBoundsCommand.getProperties().put(HEIGHT, String.valueOf(size.getWidth()));
      return changeBoundsCommand;
   }
   
   @Override
   protected CompoundCommand toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
         throws DecodingException {
   
      CompoundCommand changeBoundsCommand = new CompoundCommand();
   
      if (command instanceof CCompoundCommand) {
   
         ((CCompoundCommand) command).getCommands().forEach(cmd -> {
            // parent element
            String semanticProxyUri = cmd.getProperties().get(SEMANTIC_PROXI_URI);
            GPoint elementPosition = UmlNotationCommandUtil.getGPoint(
                  cmd.getProperties().get(POSITION_X), cmd.getProperties().get(POSITION_Y));
            GDimension elementSize = UmlNotationCommandUtil.getGDimension(cmd.getProperties().get(HEIGHT),
                  cmd.getProperties().get(WIDTH));
            changeBoundsCommand
                  .append(new ChangeBoundsCommand(domain, modelUri, semanticProxyUri, elementPosition, elementSize));
         });
      }
      return changeBoundsCommand;
   }
   */
}
