import * as vscode from 'vscode';
import { LineStruct } from '../completion';
import { generateCompletionItem, CompletionItems } from './util';

const redisItems = [
    (name: string) => `redis:"${name}"`,
];

export function generateRedisCompletion(names: string[], ls: LineStruct): vscode.CompletionItem[] {
    let items = new CompletionItems;

    for (let name of names) {
        for (let f of redisItems) {
            items.push(generateCompletionItem(f(name), ls));
        }
    }

    items.push(generateCompletionItem('redis:"-"', ls));

    return items.items;
}
