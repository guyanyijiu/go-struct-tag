import * as vscode from 'vscode';
import { LineStruct } from '../completion';
import { generateCompletionItem, CompletionItems } from './util';

const yamlItems = [
    (name: string) => `yaml:"${name}"`,
    (name: string) => `yaml:"${name},omitempty"`,
];

export function generateYamlCompletion(names: string[], ls: LineStruct): vscode.CompletionItem[] {
    let items = new CompletionItems;

    for (let name of names) {
        for (let f of yamlItems) {
            items.push(generateCompletionItem(f(name), ls));
        }
    }

    items.push(generateCompletionItem('yaml:"-"', ls));

    return items.items;
}
