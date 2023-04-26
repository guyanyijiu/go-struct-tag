import * as vscode from 'vscode';
import { updateConfigCases } from './cases';
import { updateCustomTags } from './completion';

let configListener: vscode.Disposable;

export function init() {
    loadConfig();
    configListener = vscode.workspace.onDidChangeConfiguration(() => {
        loadConfig();
    });
}

export function disposable() {
    configListener.dispose();
}

function loadConfig() {
    let caseStyles = vscode.workspace.getConfiguration('go-struct-tag').get('cases');
    if (caseStyles && Array.isArray(caseStyles)) {
        updateConfigCases(caseStyles as string[]);
    }

    let tags = vscode.workspace.getConfiguration('go-struct-tag').get('customTags');
    updateCustomTags(tags);
}