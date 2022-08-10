import * as vscode from 'vscode';
import { LineStruct } from '../completion';
import { generateCompletionItem, CompletionItems } from './util';

const bsonItems = [
    (name: string) => `bson:"${name}"`,
    (name: string) => `bson:"${name},omitempty"`,
];

export function generateBsonCompletion(names: string[], ls: LineStruct): vscode.CompletionItem[] {
    let items = new CompletionItems;

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
