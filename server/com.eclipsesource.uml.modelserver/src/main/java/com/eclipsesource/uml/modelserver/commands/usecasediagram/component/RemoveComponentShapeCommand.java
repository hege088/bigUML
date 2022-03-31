package com.eclipsesource.uml.modelserver.commands.usecasediagram.component;

import com.eclipsesource.uml.modelserver.commands.commons.notation.UmlNotationElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlNotationCommandUtil;
import com.eclipsesource.uml.modelserver.unotation.Shape;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;

public class RemoveComponentShapeCommand extends UmlNotationElementCommand {

    protected final Shape shapeToRemove;

    public RemoveComponentShapeCommand(final EditingDomain domain, final URI modelUri, final String semanticProxyUri) {
        super(domain, modelUri);
        this.shapeToRemove = UmlNotationCommandUtil.getNotationElement(modelUri, domain, semanticProxyUri, Shape.class);
    }

    @Override
    protected void doExecute() {
        umlDiagram.getElements().remove(shapeToRemove);
    }
}