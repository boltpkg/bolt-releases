// @flow
import spawn from 'projector-spawn';
import * as path from 'path';
import * as commits from './commits';

type SpawnOptions = {
  cwd?: string,
};

type GitResults = {
  stdout: string,
  code: number,
};

async function git(
  args: Array<string>,
  opts: SpawnOptions = {},
): Promise<GitResults> {
  let cmd = await spawn('git', args, opts);
  return { stdout: cmd.stdout.trim(), code: cmd.code };
}

export async function getCommitsSince(ref: string) {
  let { stdout } = await git([
    'rev-list',
    '--no-merges',
    '--abbrev-commit',
    `${ref}..HEAD`,
  ]);
  return stdout.split('\n');
}

export async function getChangedFilesSince(
  ref: string,
  fullPath: boolean = false,
) {
  // First we need to find the commit where we diverged from `ref` at using `git merge-base`
  let cmd = await git(['merge-base', ref, 'HEAD']);
  const divergedAt = cmd.stdout.trim();
  let { stdout } = await git(['diff', '--name-only', divergedAt]);
  let files = stdout.split('\n');
  if (!fullPath) return files;
  return files.map(file => path.resolve(file));
}

export async function getBranchName() {
  let { stdout } = await git(['rev-parse', '--abrev-ref', 'HEAD']);
  return stdout.split('\n');
}

export async function add(pathToFile: string) {
  let { code } = await git(['add', pathToFile]);
  return code === 0;
}

export async function commit(message: string) {
  let { code } = await git(['commit', '-m', message, '--allow-empty']);
  return code === 0;
}

export async function push(args: Array<string> = []) {
  let { code } = await git(['push', ...args]);
  return code === 0;
}

function parseCommitHashLine(line: string) {
  return line.replace('commit ', '').trim();
}

function parseCommitAuthorLine(line: string) {
  return line.replace('Author: ', '');
}

function parseCommitDateLine(line: string) {
  return new Date(line.replace('Date: ', '').trim());
}

function parseCommitMessageLines(lines: Array<string>) {
  return (
    lines
      // remove the extra padding added by git show
      .map(line => line.replace('    ', ''))
      .join('\n')
      // There is one more extra line added by git
      .trim()
  );
}

export async function getFullCommit(ref: string) {
  let { stdout } = await git(['show', ref]);
  let lines = stdout.split('\n');

  let hash = parseCommitHashLine(lines.shift());
  let author = parseCommitAuthorLine(lines.shift());
  let date = parseCommitDateLine(lines.shift());
  let message = parseCommitMessageLines(lines);

  return {
    commit: hash,
    author,
    date,
    message,
  };
}

export async function getLastPublishCommit() {
  let { stdout } = await git(['log', '-n', '50', '--oneline']);
  let results = commits.parseCommitLines(stdout);

  let latestPublishCommit = results.find(res =>
    commits.isPublishCommit(res.message),
  );

  if (!latestPublishCommit) {
    return null;
  }

  return latestPublishCommit.commit;
}

export async function getChangesetCommitsSince(ref: string) {
  let { stdout } = await git(['log', `${ref}...`, '--oneline']);
  if (stdout.length === 0) return [];
  let results = commits.parseCommitLines(stdout);

  let changesetCommits = results.filter(res =>
    commits.isChangesetCommit(res.message),
  );

  return changesetCommits.map(res => res.commit);
}

export async function getFirstCommit(opts: { cwd?: string } = {}) {
  let { stdout } = await git(['rev-list', '--max-parents=0', 'HEAD'], opts);
  // ...
}
