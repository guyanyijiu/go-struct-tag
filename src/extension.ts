import * as vscode from 'vscode';
import { generateCompletion } from './completion';
import * as config from './config';

const triggerCharacters = new Set(`abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789,;():"-`);

export function activate(context: vscode.ExtensionContext) {
	config.init();

	const structTagCompletion = vscode.languages.registerCompletionItemProvider(
		'go',
		{
			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
				return generateCompletion(document.lineAt(position).text, position);
			}
		},
		...triggerCharacters
	);

	context.subscriptions.push(structTagCompletion);
}

export function deactivate(context: vscode.ExtensionContext) {
	config.disposable();
}