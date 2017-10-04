// @flow
import type { Args, Flags } from '../types';
import * as options from '../utils/options';

type ChangelogOpts = {
  cwd?: string,
};

export function toChangelogOpts(args: Args, flags: Flags): ChangelogOpts {
  return {
    cwd: options.string(flags.cwd, 'cwd'),
  };
}

export async function changelog(opts: ChangelogOpts) {
  // ...
}
