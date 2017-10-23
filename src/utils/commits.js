// @flow

import type { JSONValue } from '../types';

export function parseChangesetCommit(commitMsg: string): JSONValue {
  let lines = commitMsg.split('\n');
  let curLine;
  let jsonStr = '';

  // Throw away all the lines until we find the separator token
  do {
    curLine = lines.shift();
  } while (curLine !== '---');

  curLine = lines.shift(); // Thow away the separator line

  // Get the json parts
  while (curLine !== '---') {
    jsonStr += curLine;
    curLine = lines.shift();
  }

  return JSON.parse(jsonStr);
}

export function isPublishCommit(message: string) {
  return message.startsWith('RELEASING: ');
}

export function isChangesetCommit(message: string) {
  return message.startsWith('CHANGESET: ');
}

type CommitLine = {
  commit: string,
  message: string,
};

export function parseCommitLine(line: string): CommitLine | null {
  let match = line.match(/([^ ]+) (.+)/);
  if (!match) return null;
  return { commit: match[1], message: match[2] };
}

export function parseCommitLines(lines: string): Array<CommitLine> {
  return lines
    .split('\n')
    .map(line => parseCommitLine(line))
    .filter(Boolean);
}
