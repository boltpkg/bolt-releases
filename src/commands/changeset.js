// @flow
import type { Args, Flags } from '../types';
import * as options from '../utils/options';
import * as logger from '../utils/logger';
import * as cli from '../utils/cli';
import Repository from '../Repository';
import Changeset from '../Changeset';
import * as bolt from 'bolt';
import * as inquirer from 'inquirer';
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

  let changedPackages = await repo.getChangedPackages();
  let changedPackagesNames = changedPackages.map(pkg => pkg.name);
  let unchangedPackagesNames = repo.packages
    .map(pkg => pkg.name)
    .filter(pkgName => !changedPackagesNames.includes(pkgName));

  // This is exposing an implementation detail of ../utils/cli
  const inquirerList = [
    new inquirer.Separator('changed packages'),
    ...changedPackagesNames,
    new inquirer.Separator('unchanged packages'),
    ...unchangedPackagesNames,
    new inquirer.Separator(),
  ];

  let packagesToRelease = await cli.askCheckbox(
    'Which of these packages would you like to create a changeset for?',
    inquirerList,
  );
  let dependentPackages = await repo.getDependentPackages(packagesToRelease);

  let changedVersionsMap = new Map();
  let dependentVersionsMap = new Map();

  for (let pkgName of packagesToRelease) {
    let type = await cli.askList(
      `What kind of change is this for ${chalk.green(pkgName)}`,
      ['patch', 'minor', 'major'],
    );
    changedVersionsMap.set(pkgName, type);
  }

  let summary = cli.askQuestion('What is the summary of these changes?');

  console.log(
    'The following dependents would also need to be bumped, is this okay?',
  );
  console.log('');
  console.log('  ' + chalk.bold('@atlaskit/media-core'));
  console.log(
    `   @atlaskit/avatar: ${chalk.red('~1.0.0')} -> ${chalk.green('~1.1.0')}`,
  );
  console.log(
    `   @atlaskit/button: ${chalk.red('^1.0.0')} -> ${chalk.green('^2.0.0')}`,
  );
  console.log(' ' + chalk.bold('@atlaskit/editor-core'));
  console.log(
    `   @atlaskit/avatar: ${chalk.red('~1.0.0')} -> ${chalk.green('~1.1.0')}`,
  );
  console.log('');
  console.log('This would be a patch release for each of the packages above.');
  let confirm = await cli.askConfirm('Is this okay?');

  return;

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
