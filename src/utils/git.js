// @flow
import spawn from 'projector-spawn';
import * as path from 'path';

// Parses lines that are in the form 'HASH message goes here'
function parseCommitLine(line) {
  // ignore first result, it is the whole pattern match
  const [, hash, message] = line.match(/([^ ]+) (.+)/);
  return { commit: hash, message };
}

export async function getCommitsSince(ref: string) {
  const gitCmd = await spawn('git', [
    'rev-list',
    '--no-merges',
    '--abbrev-commit',
    `${ref}..HEAD`,
  ]);
  return gitCmd.stdout.trim().split('\n');
}

export async function getChangedFilesSince(
  ref: string,
  fullPath: boolean = false,
) {
  const gitCmd = await spawn('git', ['diff', '--name-only', `${ref}..HEAD`]);
  const files = gitCmd.stdout.trim().split('\n');
  if (!fullPath) return files;
  return files.map(file => path.resolve(file));
}

export async function getBranchName() {
  const gitCmd = await spawn('git', ['rev-parse', '--abrev-ref', 'HEAD']);
  return gitCmd.stdout.trim().split('\n');
}

export async function add(pathToFile: string) {
  const gitCmd = await spawn('git', ['add', pathToFile]);
  return gitCmd.code === 0;
}

export async function commit(message: string) {
  const gitCmd = await spawn('git', ['commit', '-m', message, '--allow-empty']);
  return gitCmd.code === 0;
}

export async function push(args: Array<string> = []) {
  const gitCmd = await spawn('git', ['push', ...args]);
  return gitCmd.code === 0;
}

export async function getFullCommit(ref: string) {
  const gitCmd = await spawn('git', ['show', ref]);
  const lines = gitCmd.stdout.trim().split('\n');

  const hash = lines
    .shift()
    .replace('commit ', '')
    .substring(0, 7);
  const author = lines.shift().replace('Author: ', '');
  const date = new Date(
    lines
      .shift()
      .replace('Date: ', '')
      .trim(),
  );

  // remove the extra padding added by git show
  const message = lines
    .map(line => line.replace('    ', ''))
    .join('\n')
    .trim(); // There is one more extra line added by git
  return {
    commit: hash,
    author,
    date,
    message,
  };
}

export async function getLastPublishCommit() {
  const isPublishCommit = msg => msg.startsWith('RELEASING: ');

  const gitCmd = await spawn('git', ['log', '-n', '50', '--oneline']);
  const result = gitCmd.stdout
    .trim()
    .split('\n')
    .map(line => parseCommitLine(line));
  const latestPublishCommit = result.find(res => isPublishCommit(res.message));

  if (!latestPublishCommit) {
    return null;
  }

  return latestPublishCommit.commit;
}

export async function getChangesetCommitsSince(ref: string) {
  const isChangesetCommit = msg => msg.startsWith('CHANGESET: ');

  const gitCmd = await spawn('git', ['log', `${ref}...`, '--oneline']);
  const result = gitCmd.stdout.trim();

  if (result.length === 0) return [];

  const parsedResults = result.split('\n').map(line => parseCommitLine(line));
  const changesetCommits = parsedResults
    .filter(res => isChangesetCommit(res.message))
    .map(res => res.commit);

  return changesetCommits;
}

export async function getFirstCommit(opts: { cwd?: string } = {}) {
  return spawn('git', ['rev-list', '--max-parents=0', 'HEAD'], opts);
}
