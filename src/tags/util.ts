import * as vscode from 'vscode';
import { LineStruct } from '../completion';

export function generateCompletionItem(label: string, ls: LineStruct): vscode.CompletionItem | null {
    if (ls.leftContent.length > 0 && !label.startsWith(ls.leftContent)) {
        return null;
    }
    if (ls.rightContent.length > 0 && !label.endsWith(ls.rightContent)) {
        return null;
    }
    if ((ls.leftContent.length + ls.rightContent.length) >= label.length) {
        return null;
    }

    let item = new vscode.CompletionItem(label, vscode.CompletionItemKind.Text);
    item.range = new vscode.Range(ls.leftPos, ls.rightPos);
    return item;
}

export function generateFlagCompletionItems(leftContent: string, delimiter: string, flags: string[]): vscode.CompletionItem[] | null {
    let i = leftContent.lastIndexOf(delimiter);
    if (i < 0) {
        i = leftContent.lastIndexOf('"');
    }
    if (i <= 0) {
        return null;
    }

    const prefix = leftContent.substring(i + 1);

    let items: vscode.CompletionItem[] = [];
    for (let flag of flags) {
        if (flag !== prefix && flag.startsWith(prefix)) {
            let item = new vscode.CompletionItem(flag, vscode.CompletionItemKind.Text);
            items.push(item);
        }
    }

    return items;
}

export class CompletionItems {
    items: vscode.CompletionItem[];

    push(item: vscode.CompletionItem | null) {
        if (item) {
            this.items.push(item);
        }
    }

    pushAll(items: vscode.CompletionItem[] | null) {
        if (items) {
            this.items.push(...items);
        }
    }

    unshift(item: vscode.CompletionItem | null) {
        if (item) {
            this.items.unshift(item);
        }
    }

    constructor() {
        this.items = [];
    }
}
