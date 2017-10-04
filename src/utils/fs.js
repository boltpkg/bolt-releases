// @flow
import * as fs from 'fs';
import promisify from 'typeable-promisify';

export function writeFile(filePath: string, fileContents: string) {
  return promisify(cb => fs.writeFile(filePath, fileContents, cb));
}

export function readFile(filePath: string) {
  return promisify(cb => fs.readFile(filePath, cb));
}

export function rename(oldPath: string, newPath: string) {
  return promisify(cb => fs.rename(oldPath, newPath, cb));
}

export function mkdtemp(prefix: string) {
  return promisify(cb => fs.mkdtemp(prefix, cb));
}
