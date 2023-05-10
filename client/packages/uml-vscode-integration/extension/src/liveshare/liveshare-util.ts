import vscode from 'vscode';

export function isInVslsWorkspace(): boolean {
    const workspaces = vscode.workspace.workspaceFolders;
    return workspaces != null && workspaces.length > 0 && workspaces[0].uri.toString().startsWith('vsls:');
}
