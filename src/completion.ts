import * as vscode from 'vscode';
import { casedName } from './cases';
import { generateJsonCompletion } from './tags/json';
import { generateBsonCompletion } from './tags/bson';
import { generateXormCompletion } from './tags/xorm';
import { generateGormCompletion } from './tags/gorm';
import { generateFormCompletion } from './tags/form';

const supportedTags = ['json', 'bson', 'xorm', 'gorm', 'form'];

const structFieldsRegex = /^\s*([a-zA-Z_][a-zA-Z_\d]*)\s+(.+)`(.*)/;
const whitespaceRegex = /\s/;

export function generateCompletion(lineText: string, position: vscode.Position): vscode.CompletionItem[] {
    const ls = parseLineStruct(lineText, position);
    if (!ls) {
        return [];
    }

    let names = casedName(ls.fieldName);
    names = Array.from(new Set(names));

    let items: vscode.CompletionItem[] = [];

    for (let tag of ls.tags) {
        switch (tag) {
            case 'json':
                items.push(...generateJsonCompletion(names, ls));
                break;
            case 'bson':
                items.push(...generateBsonCompletion(names, ls));
                break;
            case 'xorm':
                items.push(...generateXormCompletion(names, ls));
                break;
            case 'gorm':
                items.push(...generateGormCompletion(names, ls));
                break;
            case 'form':
                items.push(...generateFormCompletion(names, ls));
                break;
        }
    }

    if (items.length === 0) {
        return items;
    }

    items[0].preselect = true;

    for (let i = 0; i < items.length; i++) {
        items[i].sortText = i.toString();
    }

    return items;
}

export type LineStruct = {
    fieldName: string
    fieldType: string
    tags: string[]
    leftContent: string
    rightContent: string
    leftPos: vscode.Position
    rightPos: vscode.Position
};

function parseLineStruct(lineText: string, position: vscode.Position): LineStruct | null {
    const results = structFieldsRegex.exec(lineText.slice(0, position.character));
    if (!results) {
        return null;
    }

    let tags: string[] = [];
    let leftContent: string = "";
    let rightContent: string = "";

    let slices = results[3].trim().split(whitespaceRegex);
    let tagContent = slices[slices.length - 1];
    tagContent = tagContent.trim();
    slices = tagContent.split(":");
    let tag = slices[0].trim();

    for (let stag of supportedTags) {
        if (stag.startsWith(tag)) {
            tags.push(stag);
        }
    }

    const maxPos = lineText.length - 1;
    let leftPos = position.character;
    let rightPos = position.character - 1;
    let chr = '';
    let hasQuota = false;
    while (true) {
        leftPos -= 1;
        if (leftPos <= 0) {
            break;
        }
        chr = lineText[leftPos];
        if (chr === '`' || whitespaceRegex.test(chr)) {
            break;
        }
        if (chr === '"') {
            hasQuota = true;
        }
        leftContent = chr + leftContent;
    }

    let leftPosition = new vscode.Position(position.line, leftPos + 1);

    let rightStopChr = (s: string): boolean => whitespaceRegex.test(s);
    if (hasQuota) {
        rightStopChr = (s: string): boolean => s === '"';
    }
    while (true) {
        rightPos += 1;
        if (rightPos >= maxPos) {
            break;
        }
        chr = lineText[rightPos];
        if (chr === '`' || rightStopChr(chr)) {
            if (chr === '"') {
                rightPos += 1;
                rightContent += chr;
            }
            break;
        }

        rightContent += chr;
    }

    let rightPosition = new vscode.Position(position.line, rightPos);

    return {
        fieldName: results[1],
        fieldType: results[2].trim(),
        tags: tags,
        leftContent: leftContent,
        rightContent: rightContent,
        leftPos: leftPosition,
        rightPos: rightPosition,
    };
}
