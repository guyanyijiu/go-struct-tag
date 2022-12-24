import * as vscode from 'vscode';
import { LineStruct } from '../completion';
import { generateCompletionItem, CompletionItems } from './util';

export function generateValidateCompletion(names: string[], ls: LineStruct): vscode.CompletionItem[] {
    let items = new CompletionItems;

    items.push(generateCompletionItem('validate:""', ls));

    return items.items;
}
