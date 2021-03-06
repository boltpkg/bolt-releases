// @flow
import stripIndent from 'strip-indent';

export function formatReleaseNotesFile(summary: string) {
  return stripIndent(`
    # New release

    ${summary}

    You can add whatever information you need to about this release. Try to mention:

    * Which packages are affected
    * What the breaking changes were
    * Reasons for these
    * Code samples for upgrading
    * Any relevant links to issues, discussions, etc
  `).trim();
}
