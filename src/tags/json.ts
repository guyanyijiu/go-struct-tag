import * as vscode from 'vscode';
import { LineStruct } from '../completion';
import { generateCompletionItem, generateFlagCompletionItems, CompletionItems } from './util';

const jsonItems = [
    (name: string) => `json:"${name}"`,
    (name: string) => `json:"${name},omitempty"`,
];

const tagDelimiter: string = ",";
const tagFlags: string[] = ["omitempty", "string"];

export function generateJsonCompletion(names: string[], ls: LineStruct): vscode.CompletionItem[] {
    let items = new CompletionItems;

    if (ls.exactTagType) {
        items.pushAll(generateFlagCompletionItems(ls.leftContent, tagDelimiter, tagFlags));
        if (items.items.length > 0) {
            return items.items;
        }
    }

    for (let name of names) {
        for (let f of jsonItems) {
            items.push(generateCompletionItem(f(name), ls));
        }
    }

    items.push(generateCompletionItem('json:"-"', ls));

    return items.items;
}
