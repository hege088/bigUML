package com.eclipsesource.uml.modelserver.commands.usecasediagram.generalization;

import com.eclipsesource.uml.modelserver.commands.commons.notation.UmlNotationElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlNotationCommandUtil;
import com.eclipsesource.uml.modelserver.unotation.Edge;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;

public class RemoveGeneralizationEdgeCommand extends UmlNotationElementCommand {

    protected final Edge edgeToRemove;

    public RemoveGeneralizationEdgeCommand(final EditingDomain domain, final URI modelUri, final String semanticProxyUri) {
        super(domain, modelUri);
        this.edgeToRemove = UmlNotationCommandUtil.getNotationElement(modelUri, domain, semanticProxyUri);
    }

    @Override
    protected void doExecute() {
        umlDiagram.getElements().remove(edgeToRemove);
    }
}