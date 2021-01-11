import * as vscode from 'vscode';
import * as util from './util';

const supportedTypes = ['json', 'bson', 'xorm', 'gorm', 'form'];
const supportedTypeMaxLen = 5;
const structFieldRegex = /^\s*([a-zA-Z_][a-zA-Z_\d]*)\s+(.+)`(.*)/;

interface MatchTypeResult {
	hit: boolean;
	word: string;
	types: string[];
}

function getCurrentWord(document: vscode.TextDocument, position: vscode.Position): string {
	const wordAtPosition = document.getWordRangeAtPosition(position);
	let currentWord = '';
	if (wordAtPosition && wordAtPosition.start.character < position.character) {
		const word = document.getText(wordAtPosition);
		let from = 0;
		let len = position.character - wordAtPosition.start.character;
		if (len > supportedTypeMaxLen) {
			from = len - supportedTypeMaxLen;
		}
		currentWord = word.substr(from, len);
	}

	return currentWord;
}

function getMatchTypes(word: string): MatchTypeResult {
	let result: MatchTypeResult = {
		hit: false,
		word: word,
		types: [],
	};
	if (word === '') {
		return result;
	}
	for (let i = 0; i < supportedTypes.length; i++) {
		if (supportedTypes[i].startsWith(word)) {
			result.hit = true;
			result.types.push(supportedTypes[i]);
		}
	}
	return result;
}

function generateJsonCompletion(fieldName: string, fieldType: string): vscode.CompletionItem[] {
	return [
		new vscode.CompletionItem(`json:"${fieldName}"`, vscode.CompletionItemKind.Text),
		new vscode.CompletionItem(`json:"${fieldName},omitempty"`, vscode.CompletionItemKind.Text),
		new vscode.CompletionItem(`json:"-"`, vscode.CompletionItemKind.Text),
	];
}

function generateFormCompletion(fieldName: string, fieldType: string): vscode.CompletionItem[] {
	return [
		new vscode.CompletionItem(`form:"${fieldName}"`, vscode.CompletionItemKind.Text),
		new vscode.CompletionItem(`form:"${fieldName},omitempty"`, vscode.CompletionItemKind.Text),
		new vscode.CompletionItem(`form:"-"`, vscode.CompletionItemKind.Text),
	];
}

function generateBsonCompletion(fieldName: string, fieldType: string): vscode.CompletionItem[] {
	let items: vscode.CompletionItem[] = [];
	if (fieldName === 'id') {
		items.push(new vscode.CompletionItem('bson:"_id"', vscode.CompletionItemKind.Text));
	}
	items.push(
		new vscode.CompletionItem(`bson:"${fieldName}"`, vscode.CompletionItemKind.Text),
		new vscode.CompletionItem(`bson:"${fieldName},omitempty"`, vscode.CompletionItemKind.Text),
		new vscode.CompletionItem('bson:"-"', vscode.CompletionItemKind.Text)
	);
	return items;
}

function generateXormCompletion(fieldName: string, fieldType: string): vscode.CompletionItem[] {
	let items: vscode.CompletionItem[] = [];

	let xormType: string = '';
	switch (fieldType) {
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

	items.push(
		new vscode.CompletionItem(`xorm:"${xormType} '${fieldName}'"`, vscode.CompletionItemKind.Text),
		new vscode.CompletionItem(`xorm:"'${fieldName}'"`, vscode.CompletionItemKind.Text),
	);

	if (xormType === 'datetime') {
		items.push(new vscode.CompletionItem(`xorm:"timestamp '${fieldName}'"`, vscode.CompletionItemKind.Text));
	} else if (xormType === 'text') {
		items.push(new vscode.CompletionItem(`xorm:"blob '${fieldName}'"`, vscode.CompletionItemKind.Text));
	} else if (fieldName === 'id' && (xormType === 'bigint' || xormType === 'int')) {
		items.unshift(new vscode.CompletionItem(`xorm:"${xormType} pk autoincr '${fieldName}'"`, vscode.CompletionItemKind.Text));
	}

	items.push(new vscode.CompletionItem('xorm:"-"', vscode.CompletionItemKind.Text));
	return items;
}

function generateGormCompletion(fieldName: string, fieldType: string): vscode.CompletionItem[] {
	let items: vscode.CompletionItem[] = [];

	let gormType: string = '';
	let gormSize: string = '';
	switch (fieldType) {
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

	if (gormSize !== '') {
		items.push(new vscode.CompletionItem(`gorm:"column:${fieldName};type:${gormType};size:${gormSize}"`, vscode.CompletionItemKind.Text));
	} else {
		items.push(new vscode.CompletionItem(`gorm:"column:${fieldName};type:${gormType}"`, vscode.CompletionItemKind.Text));
	}
	items.push(new vscode.CompletionItem(`gorm:"column:${fieldName}"`, vscode.CompletionItemKind.Text));

	if (gormType === 'datetime') {
		items.push(new vscode.CompletionItem(`gorm:"column:${fieldName};type:timestamp"`, vscode.CompletionItemKind.Text));
	} else if (gormType === 'text') {
		items.push(new vscode.CompletionItem(`gorm:"column:${fieldName};type:blob"`, vscode.CompletionItemKind.Text));
	} else if (fieldName === 'id' && (gormType === 'bigint' || gormType === 'int')) {
		items.unshift(new vscode.CompletionItem(`gorm:"column:${fieldName};type:${gormType};primaryKey;autoIncrement"`, vscode.CompletionItemKind.Text));
	}

	items.push(new vscode.CompletionItem('gorm:"-"', vscode.CompletionItemKind.Text));
	return items;
}

export function activate(context: vscode.ExtensionContext) {

	const structTagCompletion = vscode.languages.registerCompletionItemProvider(
		'go',
		{
			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
				const lineTillPosition = document.lineAt(position).text.substr(0, position.character);

				let field = structFieldRegex.exec(lineTillPosition);
				if (!field) {
					return undefined;
				}

				let word = getCurrentWord(document, position);
				let match = getMatchTypes(word);
				if (!match.hit) {
					return undefined;
				}

				let fieldName = field[1];
				let fieldNameFormat = util.gonicCasedName(fieldName);
				let fieldType = field[2].trim();
				let items: vscode.CompletionItem[] = [];

				for (let i in match.types) {
					switch (match.types[i]) {
						case 'json':
							items.push(...generateJsonCompletion(fieldNameFormat, fieldType));
							break;
						case 'bson':
							items.push(...generateBsonCompletion(fieldNameFormat, fieldType));
							break;
						case 'xorm':
							items.push(...generateXormCompletion(fieldNameFormat, fieldType));
							break;
						case 'gorm':
							items.push(...generateGormCompletion(fieldNameFormat, fieldType));
							break;
						case 'form':
							items.push(...generateFormCompletion(fieldNameFormat, fieldType));
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
		},
		'j', 's', 'o', 'n', 'b', 'x', 'r', 'm', 'g', 'f'
	);

	context.subscriptions.push(structTagCompletion);
}
