import * as vscode from 'vscode';
import { LineStruct } from '../completion';
import { generateCompletionItem, CompletionItems } from './util';

const delimiter: string = ";";
const keyFlags: string[] = [
    "default:",
    "default:null",
    "not null",
    "index",
    "uniqueIndex",
    "comment:",
    "autoIncrement",
    "size:",
    "primaryKey",
    "unique",
    "column:{{name}}",
    "type:{{type}}",
    "autoIncrementIncrement:",
    "embedded",
    "embeddedPrefix:",
    "autoCreateTime",
    "autoCreateTime:nano",
    "autoCreateTime:milli",
    "autoUpdateTime",
    "autoUpdateTime:nano",
    "autoUpdateTime:milli",
    "check:",
    "serializer:",
    "precision:",
    "scale:",
];

function makeKeyFlags(name: string, tps: string[]): string[] {
    let result: string[] = [];
    for (let v of keyFlags) {
        if (v.includes("{{name}}")) {
            result.push(v.replace("{{name}}", name));
        } else if (v.includes("{{type}}")) {
            for (let tp of tps) {
                result.push(v.replace("{{type}}", tp));
            }
        } else {
            result.push(v);
        }
    }
    return result;
}

export function generateGormCompletion(names: string[], ls: LineStruct): vscode.CompletionItem[] {
    let items = new CompletionItems;

    let gormTypes: string[] = [];
    let gormSize: string = '';
    switch (ls.fieldType) {
        case 'int':
        case 'int8':
        case 'int16':
        case 'int32':
        case 'uint':
        case 'uint8':
        case 'uint16':
        case 'uint32':
            gormTypes.push('int');
            break;
        case 'int64':
        case 'uint64':
            gormTypes.push('bigint');
            break;
        case 'float32':
            gormTypes.push('float');
            break;
        case 'float64':
            gormTypes.push('double');
            break;
        case 'bool':
            gormTypes.push('tinyint');
            break;
        case 'string':
            gormTypes.push('varchar');
            gormSize = '255';
            break;
        case 'time.Time':
            gormTypes.push('datetime', 'timestamp');
            break;
        case 'complex64':
        case 'complex128':
            gormTypes.push('varchar');
            gormSize = '64';
            break;
        default:
            gormTypes.push('text', 'blob');
            break;
    }

    for (let name of names) {
        for (let tp of gormTypes) {
            if (name === 'id' && (tp === 'bigint' || tp === 'int')) {
                items.push(generateCompletionItem(`gorm:"column:${name};type:${tp};primaryKey;autoIncrement"`, ls));
            }

            if (gormSize !== '') {
                items.push(generateCompletionItem(`gorm:"column:${name};type:${tp};size:${gormSize}"`, ls));
            }
            items.push(generateCompletionItem(`gorm:"column:${name};type:${tp}"`, ls));
        }
        items.push(generateCompletionItem(`gorm:"column:${name}"`, ls));
    }

    items.push(generateCompletionItem('gorm:"-"', ls));

    if (items.items.length === 0 && ls.exactTagType) {
        items.pushAll(generateKeyFlagCompletionItems(ls.pos, ls.leftContent, delimiter, makeKeyFlags(names[0], gormTypes)));
    }

    return items.items;
}

function generateKeyFlagCompletionItems(pos: vscode.Position, leftContent: string, delimiter: string, values: string[]): vscode.CompletionItem[] | null {
    let i = leftContent.lastIndexOf(delimiter);
    if (i < 0) {
        i = leftContent.lastIndexOf('"');
    }
    if (i <= 0) {
        return null;
    }

    const prefix = leftContent.substring(i + 1);

    let lpos = new vscode.Position(pos.line, pos.character - prefix.length);
    let items: vscode.CompletionItem[] = [];
    for (let v of values) {
        if (v !== prefix && v.startsWith(prefix)) {
            let item = new vscode.CompletionItem(v, vscode.CompletionItemKind.Text);
            item.range = new vscode.Range(lpos, pos);
            items.push(item);
        }
    }

    return items;
}
