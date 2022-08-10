import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import * as cases from '../../cases';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Sample test', () => {
		assert.equal(-1, [1, 2, 3].indexOf(5));
		assert.equal(-1, [1, 2, 3].indexOf(0));
	});
});

suite('Function Test Suite', () => {
	test('casedName test', () => {
		cases.updateConfigCases(['snake']);
		assert.strictEqual('id', cases.casedName('ID')[0]);
		assert.strictEqual('id', cases.casedName('Id')[0]);
		assert.strictEqual('user_id', cases.casedName('UserID')[0]);
		assert.strictEqual('user_id', cases.casedName('UserId')[0]);
		assert.strictEqual('user_id123', cases.casedName('UserID123')[0]);

		cases.updateConfigCases(['camel']);
		assert.strictEqual('id', cases.casedName('ID')[0]);
		assert.strictEqual('id', cases.casedName('Id')[0]);
		assert.strictEqual('userId', cases.casedName('UserID')[0]);
		assert.strictEqual('userId', cases.casedName('UserId')[0]);
		assert.strictEqual('userId123', cases.casedName('UserID123')[0]);

		cases.updateConfigCases(['pascal']);
		assert.strictEqual('Id', cases.casedName('ID')[0]);
		assert.strictEqual('Id', cases.casedName('Id')[0]);
		assert.strictEqual('UserId', cases.casedName('UserID')[0]);
		assert.strictEqual('UserId', cases.casedName('UserId')[0]);
		assert.strictEqual('UserId123', cases.casedName('UserID123')[0]);

		cases.updateConfigCases(['constant']);
		assert.strictEqual('ID', cases.casedName('ID')[0]);
		assert.strictEqual('ID', cases.casedName('Id')[0]);
		assert.strictEqual('USER_ID', cases.casedName('UserID')[0]);
		assert.strictEqual('USER_ID', cases.casedName('UserId')[0]);
		assert.strictEqual('USER_ID123', cases.casedName('UserID123')[0]);

		cases.updateConfigCases(['none']);
		assert.strictEqual('ID', cases.casedName('ID')[0]);
		assert.strictEqual('Id', cases.casedName('Id')[0]);
		assert.strictEqual('UserID', cases.casedName('UserID')[0]);
		assert.strictEqual('UserId', cases.casedName('UserId')[0]);
		assert.strictEqual('UserID123', cases.casedName('UserID123')[0]);
	});
});