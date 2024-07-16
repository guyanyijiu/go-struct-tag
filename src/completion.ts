import * as vscode from 'vscode';
import { casedName, isSupportedCase } from './cases';
import { generateJsonCompletion } from './tags/json';
import { generateBsonCompletion } from './tags/bson';
import { generateXormCompletion } from './tags/xorm';
import { generateGormCompletion } from './tags/gorm';
import { generateFormCompletion } from './tags/form';
import { generateYamlCompletion } from './tags/yaml';
import { generateBindingCompletion } from './tags/binding';
import { generateEnvCompletion, generateEnvDefaultCompletion, generateEnvExpandCompletion, generateEnvPrefixCompletion } from './tags/env';
import { generateValidateCompletion } from './tags/validate';
import { generateMapstructureCompletion } from './tags/mapstructure';
import { generateRedisCompletion } from './tags/redis';
import { generateCustomTagCompletion } from './tags/custom';

const defaultSupportedTags = ['json', 'bson', 'xorm', 'gorm', 'form', 'yaml', 'binding', 'env', 'envDefault', 'envExpand', 'envPrefix', 'validate', 'mapstructure', 'redis'];
var supportedTags: string[] = Object.assign([], defaultSupportedTags);

const structFieldsRegex = /^\s*([a-zA-Z_][a-zA-Z_\d]*)\s+(.+)`(.+)`/;
const whitespaceRegex = /\s/;


let customTags: Map<string, TagConfig> = new Map();

type TagConfig = {
    cases?: string[]
    options?: string[]
    separator?: string
};

export function updateCustomTags(tags: any) {
    if (!tags || typeof (tags) !== 'object') {
        return;
    }

    let invalidTags: string[] = [];

    customTags = new Map();

    supportedTags = Object.assign([], defaultSupportedTags);

    Object.keys(tags).forEach(k => {
        let tag = tags[k];

        if (tag.cases && !Array.isArray(tag.cases)) {
            invalidTags.push(k);
            return;
        }

        if (tag.options && !Array.isArray(tag.options)) {
            invalidTags.push(k);
            return;
        }

        if (tag.separator && typeof (tag.separator) !== 'string') {
            invalidTags.push(k);
            return;
        }

        let tc = tag as TagConfig;

        if (tc.cases && tc.cases.length > 0) {
            for (let c of tc.cases) {
                if (!isSupportedCase(c)) {
                    invalidTags.push(k);
                    return;
                }
            }
        }

        customTags.set(k, tc);
    });

    if (invalidTags.length > 0) {
        let msg = `Invalid [${invalidTags.map(c => `"${c}"`).join(', ')}] in "go-struct-tag.customTags". `;
        msg += " Reference [https://github.com/guyanyijiu/go-struct-tag#configuration](https://github.com/guyanyijiu/go-struct-tag#configuration)";
        vscode.window.showErrorMessage(msg, 'open settings.json').then(option => {
            if (option === 'open settings.json') {
                vscode.commands.executeCommand('workbench.action.openSettingsJson');
            }
        });
        return;
    }

    for (let k of customTags.keys()) {
        if (!supportedTags.includes(k)) {
            supportedTags.push(k);
        }
    }
}

export function generateCompletion(lineText: string, position: vscode.Position): vscode.CompletionItem[] {
    const ls = parseLineStruct(lineText, position);
    if (!ls) {
        return [];
    }

    let names = casedName(ls.fieldName);
    names = Array.from(new Set(names));

    let items: vscode.CompletionItem[] = [];

    for (let tag of ls.tagTypes) {
        let tc = customTags.get(tag);
        if (tc) {
            let names: string[];
            if (tc.cases !== undefined && tc.cases.length === 0) {
                names = [""];
            } else {
                names = casedName(ls.fieldName, tc.cases);
            }
            items.push(...generateCustomTagCompletion(tag, names, ls, tc.separator, tc.options));
            continue;
        }

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
            case 'yaml':
                items.push(...generateYamlCompletion(names, ls));
                break;
            case 'binding':
                items.push(...generateBindingCompletion(names, ls));
                break;
            case 'env':
                items.push(...generateEnvCompletion(names, ls));
                break;
            case 'envDefault':
                items.push(...generateEnvDefaultCompletion(names, ls));
                break;
            case 'envExpand':
                items.push(...generateEnvExpandCompletion(names, ls));
                break;
            case 'envPrefix':
                items.push(...generateEnvPrefixCompletion(names, ls));
                break;
            case 'validate':
                items.push(...generateValidateCompletion(names, ls));
                break;
            case 'mapstructure':
                items.push(...generateMapstructureCompletion(names, ls));
                break;
            case 'redis':
                items.push(...generateRedisCompletion(names, ls));
                break;
        }
    }

    if (items.length === 0) {
        return items;
    }

    items[0].preselect = true;


    for (let i = 0; i < items.length; i++) {
        items[i].sortText = String.fromCharCode(i + 48);
    }

    return items;
}

export type LineStruct = {
    fieldName: string;
    fieldType: string;
    tagTypes: string[];
    exactTagType: boolean;
    tagValue: string;
    leftContent: string;
    rightContent: string;
    leftPos: vscode.Position;
    rightPos: vscode.Position;
    pos: vscode.Position;
};

function parseLineStruct(lineText: string, position: vscode.Position): LineStruct | null {
    const results = structFieldsRegex.exec(lineText);
    if (!results) {
        return null;
    }

    let leftContent: string = "";
    let rightContent: string = "";

    const maxPos = lineText.length - 1;
    let leftPos = position.character;
    let rightPos = position.character - 1;
    let lastChrPos = position.character;
    let chr = '';
    let hasQuota = false;

    while (true) {
        leftPos -= 1;
        if (leftPos <= 0) {
            break;
        }
        chr = lineText[leftPos];
        if (chr === '`') {
            break;
        }
        if (chr === '"') {
            if (lineText[leftPos - 1] !== ":") {
                break;
            } else {
                hasQuota = true;
            }
            lastChrPos = leftPos;
        } else if (!whitespaceRegex.test(chr)) {
            lastChrPos = leftPos;
        }

        leftContent = chr + leftContent;
    }

    let spaceLen = lastChrPos - leftPos - 1;
    if (spaceLen > 0) {
        leftContent = leftContent.substring(spaceLen);
    }
    let leftPosition = new vscode.Position(position.line, lastChrPos);

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



    let tagTypes: string[] = [];
    let exactTagType: boolean = false;
    let tagValue: string = "";
    const content = leftContent + rightContent;
    const si = content.indexOf(":");
    if (si > 0) {
        tagTypes.push(content.substring(0, si));
        exactTagType = true;
        tagValue = content.substring(si + 1);
        if (tagValue.startsWith('"')) {
            tagValue = tagValue.substring(1);
        }
        if (tagValue.endsWith('"')) {
            tagValue = tagValue.substring(0, tagValue.length - 1);
        }
    } else {
        for (let stag of supportedTags) {
            if (stag.startsWith(content)) {
                tagTypes.push(stag);
            }
        }
    }

    return {
        fieldName: results[1],
        fieldType: results[2].trim(),
        tagTypes: tagTypes,
        exactTagType: exactTagType,
        tagValue: tagValue,
        leftContent: leftContent,
        rightContent: rightContent,
        leftPos: leftPosition,
        rightPos: rightPosition,
        pos: position,
    };
}
