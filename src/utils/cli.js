// @flow
import editor from 'editor';
import fs from 'fs';
import uuid from 'uuid/v1';
import inquirer from 'inquirer';

/* Notes on using inquirer:
* Each question needs a key, as inquirer is assembling an object behind-the-scenes.
* At each call, the entire responses object is returned, so we need a unique
* identifier for the name every time. This is why we are using UUIDs.
*/

function askQuestion(message: string) {
  const name = `Question-${uuid()}`;

  return inquirer
    .prompt([
      {
        message,
        name,
      },
    ])
    .then(responses => responses[name]);
}

async function askConfirm(message: string) {
  const name = `Confirm-${uuid()}`;

  return inquirer
    .prompt([
      {
        message,
        name,
        type: 'confirm',
      },
    ])
    .then(responses => responses[name]);
}

async function askList(message: string, choices: Array<string>) {
  const name = `List-${uuid()}`;

  return inquirer
    .prompt([
      {
        choices,
        message,
        name,
        type: 'list',
      },
    ])
    .then(responses => responses[name]);
}

async function askCheckbox(message: string, choices: Array<string>) {
  const name = `Checkbox-${uuid()}`;

  return inquirer
    .prompt([
      {
        choices,
        message,
        name,
        type: 'checkbox',
      },
    ])
    .then(responses => responses[name])
    .catch(e => console.log('can we do this?', e));
}

async function askEditor(pathToFile: string) {
  return new Promise((resolve, reject) => {
    editor(pathToFile, code => {
      if (code === 0) resolve();
      reject();
    });
  });
}

module.exports = {
  askQuestion,
  askConfirm,
  askList,
  askCheckbox,
  askEditor,
};
