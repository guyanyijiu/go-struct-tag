import * as vscode from 'vscode';
import { LineStruct } from '../completion';
import { generateCompletionItem, generateFlagCompletionItems, CompletionItems } from './util';

const formItems = [
    (name: string) => `form:"${name}"`,
    (name: string) => `form:"${name},omitempty"`,
];

const tagDelimiter: string = ",";
const tagFlags: string[] = ["omitempty"];

export function generateFormCompletion(names: string[], ls: LineStruct): vscode.CompletionItem[] {
    let items = new CompletionItems;

    if (ls.exactTagType) {
        items.pushAll(generateFlagCompletionItems(ls.leftContent, tagDelimiter, tagFlags));
        if (items.items.length > 0) {
            return items.items;
        }
    }

    for (let name of names) {
        for (let f of formItems) {
            items.push(generateCompletionItem(f(name), ls));
        }
    }

    items.push(generateCompletionItem('form:"-"', ls));

    return items.items;
}
