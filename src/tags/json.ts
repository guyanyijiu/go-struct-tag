import * as vscode from 'vscode';
import { LineStruct } from '../completion';
import { generateCompletionItem, CompletionItems } from './util';

const jsonItems = [
    (name: string) => `json:"${name}"`,
    (name: string) => `json:"${name},omitempty"`,
];

export function generateJsonCompletion(names: string[], ls: LineStruct): vscode.CompletionItem[] {
    let items = new CompletionItems;

    for (let name of names) {
        for (let f of jsonItems) {
            items.push(generateCompletionItem(f(name), ls));
        }
    }

    items.push(generateCompletionItem('json:"-"', ls));

    return items.items;
}
