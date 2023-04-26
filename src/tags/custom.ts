import * as vscode from 'vscode';
import { LineStruct } from '../completion';
import { generateCompletionItem, generateFlagCompletionItems, CompletionItems } from './util';

const omitOption = '-';

export function generateCustomTagCompletion(tag: string, names: string[], ls: LineStruct, separator?: string, options?: string[]): vscode.CompletionItem[] {
    let items = new CompletionItems;

    if (!separator) {
        separator = ",";
    }
    if (!options) {
        options = [];
    }

    if (ls.exactTagType && options.length > 0) {
        let filterOptions = options.filter(v => {
            return v !== omitOption;
        });
        items.pushAll(generateFlagCompletionItems(ls.leftContent, separator, filterOptions));
        if (items.items.length > 0) {
            return items.items;
        }
    }

    for (let name of names) {
        items.push(generateCompletionItem(`${tag}:"${name}"`, ls));
        if (options.length > 0) {
            for (let op of options) {
                if (op === omitOption) {
                    items.push(generateCompletionItem(`${tag}:"${op}"`, ls));
                } else {
                    items.push(generateCompletionItem(`${tag}:"${name}${separator}${op}"`, ls));
                }
            }
        }
    }

    return items.items;
}
