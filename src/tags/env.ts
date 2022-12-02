import * as vscode from 'vscode';
import { LineStruct } from '../completion';
import { generateCompletionItem, CompletionItems } from './util';

const envItems = [
    (name: string) => `env:"${name}"`,
    (name: string) => `env:"${name}" envDefault:""`,
];

export function generateEnvCompletion(names: string[], ls: LineStruct): vscode.CompletionItem[] {
    let items = new CompletionItems;

    names = Array.from(new Set(names.map(n => { return n.toUpperCase(); })));

    for (let name of names) {
        for (let f of envItems) {
            items.push(generateCompletionItem(f(name), ls));
        }
    }

    return items.items;
}
