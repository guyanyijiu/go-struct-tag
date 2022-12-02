import * as vscode from 'vscode';
import { LineStruct } from '../completion';
import { generateCompletionItem, CompletionItems } from './util';

const jsonItems = [
    (name: string) => `json:"${name}"`,
    (name: string) => `json:"${name},omitempty"`,
];

const jsonDelimiter: string = ",";
const jsonTagValues: string[] = ["omitempty", "string", "-"];

export function generateJsonCompletion(names: string[], ls: LineStruct): vscode.CompletionItem[] {
    let items = new CompletionItems;

    for (let name of names) {
        for (let f of jsonItems) {
            items.push(generateCompletionItem(f(name), ls));
        }
    }

    items.push(generateCompletionItem('json:"-"', ls));

    if (items.items.length === 0 && ls.exactTagType) {
        items.pushAll(parseTagValue(ls.leftContent, jsonDelimiter, jsonTagValues));
    }

    return items.items;
}

function parseTagValue(leftContent: string, delimiter: string, values: string[]): vscode.CompletionItem[] | null {
    let i = leftContent.lastIndexOf(delimiter);
    console.log("1--i: ", i);
    if (i < 0) {
        i = leftContent.lastIndexOf('"');
    }
    console.log("2--i: ", i);
    if (i <= 0) {
        return null;
    }

    const prefix = leftContent.substring(i + 1);
    console.log("prefix: ", prefix);
    let items: vscode.CompletionItem[] = [];
    for (let v of values) {
        if (v !== prefix && v.startsWith(prefix)) {
            let item = new vscode.CompletionItem(v, vscode.CompletionItemKind.Text);
            items.push(item);
        }
    }

    return items;
}