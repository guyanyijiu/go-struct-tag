import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import * as util from '../../util';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Sample test', () => {
		assert.equal(-1, [1, 2, 3].indexOf(5));
		assert.equal(-1, [1, 2, 3].indexOf(0));
	});
});

suite('Function Test Suite', () => {
	test('isASCIIUpper test', () => {
		assert.strictEqual(true, util.isASCIIUpper('A'));
		assert.strictEqual(true, util.isASCIIUpper('Z'));
		assert.strictEqual(false, util.isASCIIUpper('a'));
		assert.strictEqual(false, util.isASCIIUpper('z'));
	});

	test('gonicCasedName test', () => {
		assert.strictEqual('id', util.gonicCasedName('ID'));
		assert.strictEqual('user_id', util.gonicCasedName('UserID'));
		assert.strictEqual('my_uid', util.gonicCasedName('MyUID'));
		assert.strictEqual('seq_id_tag', util.gonicCasedName('SeqIDTag'));
	});
});