import * as vscode from 'vscode';
import { camelCase } from "camel-case";
import { snakeCase } from "snake-case";
import { pascalCase } from "pascal-case";
import { constantCase } from "constant-case";

const supportedCases: string[] = ['snake', 'camel', 'pascal', 'constant', 'none'];
const defaultCases: string[] = ['snake', 'camel'];

let configCases: string[] = [];

export function updateConfigCases(cases: string[]) {
    let invalidCases: string[] = [];

    configCases = [];

    for (let cs of cases) {
        if (supportedCases.includes(cs)) {
            configCases.push(cs);
        } else {
            invalidCases.push(cs);
        }
    }

    if (configCases.length === 0) {
        configCases = defaultCases;
    }

    if (invalidCases.length > 0) {
        let msg = `go-struct-tag: Invalid [${invalidCases.map(c => `"${c}"`).join(',')}] in "go-struct-tag.cases" configuration`;
        vscode.window.showInformationMessage(msg, 'Open Config').then(option => {
            if (option === 'Open Config') {
                vscode.commands.executeCommand('workbench.action.openSettingsJson');
            }
        });
    }
}

export function casedName(name: string): string[] {
    let result: string[] = [];

    for (let cs of configCases) {
        switch (cs) {
            case 'snake':
                result.push(snakeCase(name));
                break;
            case 'camel':
                result.push(camelCase(name));
                break;
            case 'pascal':
                result.push(pascalCase(name));
                break;
            case 'constant':
                result.push(constantCase(name));
                break;
            case 'none':
                result.push(name);
                break;
        }
    }

    return result;
}
