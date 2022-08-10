import * as vscode from 'vscode';
import { LineStruct } from '../completion';
import { generateCompletionItem, CompletionItems } from './util';

const xormItems = [
    (name: string, xtype: string) => `xorm:"${xtype} '${name}'"`,
    (name: string, xtype: string) => `xorm:"'${name}'"`,
];

export function generateXormCompletion(names: string[], ls: LineStruct): vscode.CompletionItem[] {
    let items = new CompletionItems;

    let xormType: string = '';
    switch (ls.fieldType) {
        case 'int':
        case 'int8':
        case 'int16':
        case 'int32':
        case 'uint':
        case 'uint8':
        case 'uint16':
        case 'uint32':
            xormType = 'int';
            break;
        case 'int64':
        case 'uint64':
            xormType = 'bigint';
            break;
        case 'float32':
            xormType = 'float';
            break;
        case 'float64':
            xormType = 'double';
            break;
        case 'bool':
            xormType = 'tinyint';
            break;
        case 'string':
            xormType = 'varchar(255)';
            break;
        case 'time.Time':
            xormType = 'datetime';
            break;
        case 'complex64':
        case 'complex128':
            xormType = 'varchar(64)';
            break;
        default:
            xormType = 'text';
            break;
    }

    for (let name of names) {
        if (name === 'id' && (xormType === 'bigint' || xormType === 'int')) {
            items.push(generateCompletionItem(`xorm:"${xormType} pk autoincr '${name}'"`, ls));
        }

        for (let f of xormItems) {
            items.push(generateCompletionItem(f(name, xormType), ls));
        }

        switch (xormType) {
            case 'datetime':
                items.push(generateCompletionItem(`xorm:"timestamp '${name}'"`, ls));
                break;
            case 'text':
                items.push(generateCompletionItem(`xorm:"blob '${name}'"`, ls));
                break;
        }
    }

    items.push(generateCompletionItem('xorm:"-"', ls));

    return items.items;
}
