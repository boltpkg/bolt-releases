# Bolt Releases

This package exists as a supplementary tool to enhance your [bolt](https://github.com/boltpkg/bolt) workflow by providing a way to curate releases and generate changelogs automatically.

This is achieved by using `changeset` and `release` commits (see below).

## Usage

```sh
bolt-releases changeset
```

This will create a `changeset` commit that contains the information required to perform a release.


```sh
bolt-releases version
```

This command would normally be run in CI and is used to actually upate all the versions for each package mentioned in a `changeset` commit.

Multiple `changeset` commits will be combined and all dependencies will be updated across the Project.

```sh
bolt-releases changelog
```

This command would normally be run in CI and is used to update the changelogs for each package. Changelogs will need to be stored in the root of a packages directory and be called `CHANGELOG.md`.

```sh
bolt-releases validate
```

This command would normally be run in CI and is used to check the validity of your git history.

This can fail for a couple of reasons:

* A commit has been made after a changeset that doesnt include the `[ok]` tag at the front.
* A changeset commit's human readable message does not match the json stored in it (someone has ammended a message but not updated the json representation)
