// @flow
import type Repository from './Repository';
import type { Package } from './types';

export default class Changeset {
  repo: Repository;

  constructor(repo: Repository) {
    this.repo = repo;
  }

  static async init(repo: Repository) {
    return new Changeset(repo);
  }

  getReleaseNotes(): Array<string> {
    // ...
    return [];
  }

  toCommitString(opts: {
    summary: string,
    releaseNotes: Array<string>,
    changedVersionsMap: Map<Package, string>,
    dependentVersionsMap: Map<Package, string>,
  }) {
    // ...
  }
}
