# Release process

Steps to take when releasing new module versions.

## Version bump

First, bump the `package.json` and `package-lock.json` files for each package
you want to release a new version of.

Versions should follow [semver](https://semver.org) guidelines and make use of
the [`npm version`](https://docs.npmjs.com/cli/v8/commands/npm-version) command to do the bump locally.

Commit these changes together with the changelogs for all packages in the release. The commit message can
be simply `Publish` to match what Lerna used to do. See an [example from the last Lerna publish](https://github.com/tyhopp/prpl/commit/8e8ae1544f7f3bde2c949445ba8158bd89c5b5a7).

This process is manual for the time being since the project no longer uses Lerna.

## Changelog update

Update the changelogs with relevant information for each updated package. Follow the conventions used
already in the changelog and only include meaningful changes.

This process is manual for the time being since the project no longer uses Lerna.

## Publish dry run

Run a dry run of the publish command prior to running an actual publish.

To dry run a publish of all packages, run:

```
npm run publish -- --dry-run
```

To dry run a publish of certain packages (e.g. `core` and `server`), run:

```
npm run publish -- --dry-run core server
```

This should build the relevant packages and show log output of what package versions would have been published.

## Publish

Run an actual publish the same way as the dry run but without the dry run argument:

To publish all packages, run:

```
npm run publish
```

To publish certain packages (e.g. `core` and `server`), run:

```
npm run publish -- core server
```

## Verify

Verify packages were published successfully, check [npmjs.com](https://www.npmjs.com) and/or run:

```
npm view [PACKAGE]
```

## Update sites

Once the released packages are verified, update docs and example sites by checking out `main` and then running:

```
git checkout -b chore-update-sites
npm run update:sites
git push
```

Create a PR in the GitHub web app, review changes, and merge to `main`.

## Done

That's it!

This project used to have more automation, but has removed Lerna since it's no longer maintained and does way more than what this project requires.

Over time I'd like to automate version bumping and changelog updates again but without any third party dependencies. If you're interested in helping out, please feel free to open a PR!
