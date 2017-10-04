// @flow
import type { Args, Flags } from '../types';
import * as options from '../utils/options';

type ReleaseOpts = {
  cwd?: string,
};

export function toReleaseOpts(args: Args, flags: Flags): ReleaseOpts {
  return {
    cwd: options.string(flags.cwd, 'cwd'),
  };
}

export async function release(opts: ReleaseOpts) {
  // ...
}
