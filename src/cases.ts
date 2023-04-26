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
        let msg = `Invalid [${invalidCases.map(c => `"${c}"`).join(', ')}] in "go-struct-tag.cases". `;
        msg += " Reference [https://github.com/guyanyijiu/go-struct-tag#configuration](https://github.com/guyanyijiu/go-struct-tag#configuration)";
        vscode.window.showErrorMessage(msg, 'open settings.json').then(option => {
            if (option === 'open settings.json') {
                vscode.commands.executeCommand('workbench.action.openSettingsJson');
            }
        });
    }
}

export function casedName(name: string, cases?: string[]): string[] {
    let result: string[] = [];

    if (!cases || cases.length === 0) {
        cases = configCases;
    }

    for (let cs of cases) {
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

export function isSupportedCase(c: string): boolean {
    return supportedCases.includes(c);
}