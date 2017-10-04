// @flow
import type { Args, Flags } from '../types';
import * as options from '../utils/options';
import * as logger from '../utils/logger';
import * as cli from '../utils/cli';
import Repository from '../Repository';
import Changeset from '../Changeset';
import chalk from 'chalk';

type ChangesetOpts = {
  cwd?: string,
};

export function toChangesetOpts(args: Args, flags: Flags): ChangesetOpts {
  return {
    cwd: options.string(flags.cwd, 'cwd'),
  };
}

export async function changeset(opts: ChangesetOpts) {
  let cwd = opts.cwd || process.cwd();
  let repo = await Repository.init({ cwd });
  // let changeset = await Changeset.init(repo);

  let changedPackages = await repo.getChangedPackages();
  let packagesToRelease = await cli.ask(
    'Which of these changed packages would you like to create a changeset for?',
    changedPackages,
  );
  let dependentPackages = await repo.getDependentPackages(packagesToRelease);

  let changedVersionsMap = new Map();
  let dependentVersionsMap = new Map();

  for (let pkg of packagesToRelease) {
    let type = await cli.askList(
      `What kind of change is this for ${pkg.name}`,
      ['patch', 'minor', 'major'],
    );
    changedVersionsMap.set(pkg.name, type);
  }

  let summary = cli.askQuestion('What is the summary of these changes?');

  for (let pkg of dependentPackages) {
    let type = await cli.askList(
      `What kind of change is this for ${pkg.name}`,
      ['patch', 'minor', 'major'],
    );
    dependentVersionsMap.set(pkg.name, type);
  }

  let releaseNotes;

  // if (hasReleaseNotes) {
  //   releaseNotes = ...;
  // } else if (CONFIG.SHOULD_PROMPT_RELEASE_NOTES_ON_MAJOR_SDKJASD) {
  //   if (includesMajorVersion... ) {
  //     let releaseNotes = createNewReleaseNotes();
  //   }
  // }

  let commitStr = changeset.toCommitString({
    summary,
    releaseNotes,
    changedVersionsMap,
    dependentVersionsMap,
  });

  // console.log(chalk.green('Creating new Changeset commit...\n'));
  // console.log(commitStr);
  // const confirmCommit = await cli.askConfirm('Commit this Changeset?');
  //
  // if (confirmCommit) {
  //   await git.commit(commitStr);
  //   console.log(chalk.green('Changeset committed!'));
  // }
}
