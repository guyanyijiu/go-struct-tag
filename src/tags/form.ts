import * as vscode from 'vscode';
import { LineStruct } from '../completion';
import { generateCompletionItem, CompletionItems } from './util';

const formItems = [
    (name: string) => `form:"${name}"`,
    (name: string) => `form:"${name},omitempty"`,
];

export function generateFormCompletion(names: string[], ls: LineStruct): vscode.CompletionItem[] {
    let items = new CompletionItems;

    for (let name of names) {
        for (let f of formItems) {
            items.push(generateCompletionItem(f(name), ls));
        }
    }

    items.push(generateCompletionItem('form:"-"', ls));

    return items.items;
}
