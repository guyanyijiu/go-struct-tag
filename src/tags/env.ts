import * as vscode from 'vscode';
import { LineStruct } from '../completion';
import { generateCompletionItem, generateFlagCompletionItems, CompletionItems } from './util';

const envItems = [
    (name: string) => `env:"${name}"`,
    (name: string) => `env:"${name}" envDefault:""`,
];

const tagDelimiter: string = ",";
const tagFlags: string[] = ["required", "notEmpty", "unset", "file"];

export function generateEnvCompletion(names: string[], ls: LineStruct): vscode.CompletionItem[] {
    let items = new CompletionItems;

    if (ls.exactTagType) {
        items.pushAll(generateFlagCompletionItems(ls.leftContent, tagDelimiter, tagFlags));
        if (items.items.length > 0) {
            return items.items;
        }
    }

    names = Array.from(new Set(names.map(n => { return n.toUpperCase(); })));

    for (let name of names) {
        for (let f of envItems) {
            items.push(generateCompletionItem(f(name), ls));
        }
    }

    return items.items;
}

export function generateEnvDefaultCompletion(names: string[], ls: LineStruct): vscode.CompletionItem[] {
    let items = new CompletionItems;

    items.push(generateCompletionItem(`envDefault:""`, ls));

    return items.items;
}

export function generateEnvExpandCompletion(names: string[], ls: LineStruct): vscode.CompletionItem[] {
    let items = new CompletionItems;

    items.push(generateCompletionItem(`envExpand:"true"`, ls));

    return items.items;
}

export function generateEnvPrefixCompletion(names: string[], ls: LineStruct): vscode.CompletionItem[] {
    let items = new CompletionItems;

    items.push(generateCompletionItem(`envPrefix:""`, ls));

    return items.items;
}
