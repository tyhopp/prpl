# Development process

This project makes use of [npm workspaces](https://docs.npmjs.com/cli/v8/using-npm/workspaces).

## Installation

In the project root, run:

```
npm i
```

This will install all dependencies for all workspaces. No need to install in any subdirectories.

## Development

To watch changes in source code for specific packages (e.g. `core` and `server`), run:

```
npm run dev core server
```

When you make changes to these package's source code, Rollup will notice and re-bundle them.

Then navigate to an example project and run the `npm run build` or `npm run dev` commands as per usual. Example project dependencies will automagically be imported from the relevant package workspace, removing the need for `npm link`.

If you are working with a site outside of a workspace, then you'll still need to `npm link`. Make sure you're using the same Node version in the terminal windows you use since `npm link` works by symlinking to specific Node versions.
