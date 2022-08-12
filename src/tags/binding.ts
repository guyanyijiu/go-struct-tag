import * as vscode from 'vscode';
import { LineStruct } from '../completion';
import { generateCompletionItem, CompletionItems } from './util';

export function generateBindingCompletion(names: string[], ls: LineStruct): vscode.CompletionItem[] {
    let items = new CompletionItems;

    items.push(generateCompletionItem('binding:"required"', ls));
    items.push(generateCompletionItem('binding:"-"', ls));

    return items.items;
}
