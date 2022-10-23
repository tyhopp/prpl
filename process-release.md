# Release process

Steps to take when releasing new module versions.

## Version bump

Check out the `main` branch and `git pull` so you have the latest.

To bump all packages:

```bash
npm version patch --workspace=packages # Or minor, major, etc.
```

To bump certain packages:

```bash
cd packages/core # Or some other package
npm version patch # Or minor, major, etc.
```

Stage and commit the changes:

```bash
git add .
git commit -m "chore: Release 0.4.0" # Swap with target version
```

## Publish dry run

To dry run a publish of all packages:

```bash
npm publish --dry-run --workspace=packages
```

To dry run a publish of certain packages (e.g. `core`):

```bash
cd packages/core # Or some other package
npm publish --dry-run
```

This should build the relevant packages and show log output of what package versions would have been published. Check it is correct.

## Publish

Use the same commands as the publish dry run without the `--dry-run` argument.

## Verify

Verify packages were published successfully, check [npmjs.com](https://www.npmjs.com) and/or run:

```bash
npm view [PACKAGE]
```

Once verified, push the version bump changes commit to remote:

```bash
git push
```

## Create tag

If `core` was bumped, create a new tag and push it:

```bash
# Swap with target versions
git tag @prpl/core@0.4.0
git push origin @prpl/core@0.4.0
```

Tags should not be created for other packages.

## Changelog update

Update the changelogs with relevant information for each updated package.

This process is manual for the time being since the project no longer uses Lerna.

## Update sites

Update docs and example sites by checking out `main` and then running:

```bash
git checkout -b chore-update-sites
npm run update-sites
git push
```

Create a PR in the GitHub web app, review changes, and merge to `main`.

## Create a GitHub release (optional)

For substantial changes, create a GitHub release from the new tag in GitHub. List what the release contains in the description with links to PRs.

## Done

That's it!

This project used to have more automation, but has removed Lerna since it's no longer maintained and does way more than what this project requires.

Over time I'd like to automate changelog updates again but without any third party dependencies. If you're interested in helping out, please feel free to open a PR!
