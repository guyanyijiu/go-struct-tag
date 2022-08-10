import * as vscode from 'vscode';
import { LineStruct } from '../completion';
import { generateCompletionItem, CompletionItems } from './util';

export function generateGormCompletion(names: string[], ls: LineStruct): vscode.CompletionItem[] {
    let items = new CompletionItems;

    let gormType: string = '';
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
            gormType = 'int';
            break;
        case 'int64':
        case 'uint64':
            gormType = 'bigint';
            break;
        case 'float32':
            gormType = 'float';
            break;
        case 'float64':
            gormType = 'double';
            break;
        case 'bool':
            gormType = 'tinyint';
            break;
        case 'string':
            gormType = 'varchar';
            gormSize = '255';
            break;
        case 'time.Time':
            gormType = 'datetime';
            break;
        case 'complex64':
        case 'complex128':
            gormType = 'varchar';
            gormSize = '64';
            break;
        default:
            gormType = 'text';
            break;
    }

    for (let name of names) {
        if (name === 'id' && (gormType === 'bigint' || gormType === 'int')) {
            items.push(generateCompletionItem(`gorm:"column:${name};type:${gormType};primaryKey;autoIncrement"`, ls));
        }

        if (gormSize !== '') {
            items.push(generateCompletionItem(`gorm:"column:${name};type:${gormType};size:${gormSize}"`, ls));
        } else {
            items.push(generateCompletionItem(`gorm:"column:${name};type:${gormType}"`, ls));
        }
        items.push(generateCompletionItem(`gorm:"column:${name}"`, ls));

        if (gormType === 'datetime') {
            items.push(generateCompletionItem(`gorm:"column:${name};type:timestamp"`, ls));
        } else if (gormType === 'text') {
            items.push(generateCompletionItem(`gorm:"column:${name};type:blob"`, ls));
        }
    }

    items.push(generateCompletionItem('gorm:"-"', ls));

    return items.items;
}
