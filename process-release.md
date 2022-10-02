# Release process

Steps to take when releasing new module versions.

## Version bump

First, bump the `package.json` and `package-lock.json` files for each package
you want to release a new version of.

Versions should follow [semver](https://semver.org) guidelines and make use of
the [`npm version`](https://docs.npmjs.com/cli/v8/commands/npm-version) command to do the bump locally.

If you want to bump all packages (e.g. with a patch bump), run:

```
npm run version patch
```

If you want to only bump certain packages, then you can manually navigate to the respective package directories (e.g. core), and run:

```
npm version patch
```

These changes can be in the same commit together with the changelog updates in the next step.

## Publish dry run

Run a dry run of the publish command prior to running an actual publish.

To dry run a publish of all packages, run:

**Note** - Arguments are positional.

```
npm run publish dry-run
```

To dry run a publish of certain packages (e.g. `core` and `server`), run:

**Note** - Arguments are positional.

```
npm run publish dry-run core server
```

This should build the relevant packages and show log output of what package versions would have been published.

## Publish

Run an actual publish the same way as the dry run but without the dry run argument:

To publish all packages, get a one-time password from an authenticator app and run:

**Note** - Arguments are positional.

```
npm run publish [OTP]
```

To publish certain packages (e.g. `core` and `server`), run:

**Note** - Arguments are positional.

```
npm run publish [OTP] core server
```

## Verify

Verify packages were published successfully, check [npmjs.com](https://www.npmjs.com) and/or run:

```
npm view [PACKAGE]
```

## Changelog update

Update the changelogs with relevant information for each updated package.

This process is manual for the time being since the project no longer uses Lerna.

## Update sites

Update docs and example sites by checking out `main` and then running:

```
git checkout -b chore-update-sites
npm run update:sites
git push --set-upstream origin chore-update-sites
```

Create a PR in the GitHub web app, review changes, and merge to `main`.

## Done

That's it!

This project used to have more automation, but has removed Lerna since it's no longer maintained and does way more than what this project requires.

Over time I'd like to automat changelog updates again but without any third party dependencies. If you're interested in helping out, please feel free to open a PR!
