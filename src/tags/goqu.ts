import * as vscode from 'vscode';
import { LineStruct } from '../completion';
import { generateCompletionItem, generateFlagCompletionItems, CompletionItems } from './util';

const goquItems = [
  (name: string) => `goqu:"${name}"`,
  (name: string) => `goqu:"${name},skipinsert"`,
  (name: string) => `goqu:"${name},skipupdate"`,
  (name: string) => `goqu:"${name},defaultifempty"`,
  (name: string) => `goqu:"${name},omitnil"`,
  (name: string) => `goqu:"${name},omitempty"`,
];

const tagDelimiter: string = ",";
const tagFlags: string[] = ["skipinsert", "skipupdate", "defaultifempty", "omitnil", "omitempty"];

export function generateGoquCompletion(names: string[], ls: LineStruct): vscode.CompletionItem[] {
  let items = new CompletionItems;

  if (ls.exactTagType) {
    items.pushAll(generateFlagCompletionItems(ls.leftContent, tagDelimiter, tagFlags));
    if (items.items.length > 0) {
      return items.items;
    }
  }

  for (let name of names) {
    for (let f of goquItems) {
      items.push(generateCompletionItem(f(name), ls));
    }
  }

  items.push(generateCompletionItem('goqu:"-"', ls));

  return items.items;
}
