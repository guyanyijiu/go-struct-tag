import * as vscode from 'vscode';
import { LineStruct } from '../completion';
import { generateCompletionItem, generateFlagCompletionItems, CompletionItems } from './util';

const yamlItems = [
    (name: string) => `yaml:"${name}"`,
    (name: string) => `yaml:"${name},omitempty"`,
];

const tagDelimiter: string = ",";
const tagFlags: string[] = ["omitempty", "flow", "inline"];

export function generateYamlCompletion(names: string[], ls: LineStruct): vscode.CompletionItem[] {
    let items = new CompletionItems;

    if (ls.exactTagType) {
        items.pushAll(generateFlagCompletionItems(ls.leftContent, tagDelimiter, tagFlags));
        if (items.items.length > 0) {
            return items.items;
        }
    }

    for (let name of names) {
        for (let f of yamlItems) {
            items.push(generateCompletionItem(f(name), ls));
        }
    }

    items.push(generateCompletionItem('yaml:"-"', ls));

    return items.items;
}
