import * as vscode from 'vscode';
import { LineStruct } from '../completion';
import { generateCompletionItem, generateFlagCompletionItems, CompletionItems } from './util';

const mapstructureItems = [
    (name: string) => `mapstructure:"${name}"`,
];

const tagDelimiter: string = ",";
const tagFlags: string[] = ["omitempty", "remain", "squash"];

export function generateMapstructureCompletion(names: string[], ls: LineStruct): vscode.CompletionItem[] {
    let items = new CompletionItems;

    if (ls.exactTagType) {
        items.pushAll(generateFlagCompletionItems(ls.leftContent, tagDelimiter, tagFlags));
        if (items.items.length > 0) {
            return items.items;
        }
    }

    for (let name of names) {
        for (let f of mapstructureItems) {
            items.push(generateCompletionItem(f(name), ls));
        }
    }

    return items.items;
}
