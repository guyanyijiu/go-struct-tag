import * as vscode from 'vscode';
import { LineStruct } from '../completion';
import { generateCompletionItem, generateFlagCompletionItems, CompletionItems } from './util';

const bsonItems = [
    (name: string) => `bson:"${name}"`,
    (name: string) => `bson:"${name},omitempty"`,
];

const tagDelimiter: string = ",";
const tagFlags: string[] = ["omitempty", "minsize", "truncate", "inline"];

export function generateBsonCompletion(names: string[], ls: LineStruct): vscode.CompletionItem[] {
    let items = new CompletionItems;

    if (ls.exactTagType) {
        items.pushAll(generateFlagCompletionItems(ls.leftContent, tagDelimiter, tagFlags));
        if (items.items.length > 0) {
            return items.items;
        }
    }

    for (let name of names) {
        if (name === 'id') {
            items.push(generateCompletionItem('bson:"_id"', ls));
            continue;
        }
        for (let f of bsonItems) {
            items.push(generateCompletionItem(f(name), ls));
        }
    }

    items.push(generateCompletionItem('bson:"-"', ls));

    return items.items;
}
