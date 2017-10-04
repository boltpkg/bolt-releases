// @flow

import releases from './';
import meow from 'meow';
import * as commands from './commands';
import type { Args, Flags } from './types';

function runCommand(args: Args, flags: Flags) {
  let [command, ...commandArgs] = args;

  if (command === 'changelog') {
    return commands.changelog(commands.toChangelogOpts(commandArgs, flags));
  } else if (command === 'changeset') {
    return commands.changeset(commands.toChangesetOpts(commandArgs, flags));
  } else if (command === 'release') {
    return commands.release(commands.toReleaseOpts(commandArgs, flags));
  } else {
    throw new Error(`No command named: ${command}`);
  }
}

export default async function cli(argv: Args) {
  const { pkg, input, flags } = meow({
    argv,
    help: `
      TODO
    `,
    flags: {
      '--': true,
    },
  });

  await runCommand(input, flags);
}
