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

export class CompletionItems {
    items: vscode.CompletionItem[];

    push(item: vscode.CompletionItem | null) {
        if (item) {
            this.items.push(item);
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
