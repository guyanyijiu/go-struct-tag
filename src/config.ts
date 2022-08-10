import * as vscode from 'vscode';
import { updateConfigCases } from './cases';

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
}