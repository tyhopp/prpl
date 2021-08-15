# PRPL

PPRL is a **modular** static site generator built for **longevity**. It lets you interpolate HTML without the kitchen sink.

## Why?

All the static site generators I have tried have one or more of these problems:

- Built on an underlying framework like React, Vue, etc.
- Relies on complex build tools like Webpack, Babel, etc.
- Depends on a massive tree of modules that force constant maintenance
- Has interfaces, source code and documentation that cannot be understood in one sitting
- Requires that your site source be organized in a way that looks nothing like your output
- Forces a huge leap from hello world to a real world implementation

PRPL is my answer to these gripes.

## Usage

PRPL transforms a directory of content into HTML via `<prpl>` tags:

Given this source HTML file:

```html
<!DOCTYPE html>
<prpl type="page" src="content/notes">
  <head>
    <title>[title]</title>
  </head>
  <body>
    <main>
      <h1>[title]</h1>
      [body]
    </main>
  </body>
</prpl>
```

and this content markdown file:

```markdown
<!--
title: Hello world!
slug: /notes/my-first-note
-->

This is my first note
```

the output is:

```html
<!DOCTYPE html>
<head>
  <title>Hello World!</title>
</head>
<body>
  <main>
    <h1>Hello World!</h1>
    <p>This is my first note</p>
  </main>
</body>
```

- Run `npx -y create-prpl@latest` to clone the minimal starter and run it locally
- See [prpl.dev](https://prpl.dev) (WIP, not deployed yet) for full documentation, guides and design decisions

## Features

- HTML-based API compliant with web standards
- Command line, CommonJS and ECMAScript module interfaces
- Source code that is fully typed, explicitly commented and readable in one sitting
- Library architecture for modular adoption
- Minimally invasive, removable in seconds
- Opt-out of client side JavaScript entirely
- Define your own template syntax

## Architecture

PRPL is structured as a library that consists of these modules:

| Module | Description |
| --- | --- |
| [`@prpl/core`](packages/core/README.md) | Core functions for content interpolation |
| [`@prpl/server`](packages/server/README.md) | Development server |
| [`@prpl/plugin-aws`](packages/plugin-aws/README.md) | Plugin for working with AWS S3 |
| [`@prpl/plugin-cache`](packages/plugin-cache/README.md) | Plugin for cache manipulation |
| [`@prpl/plugin-code-highlight`](packages/plugin-code-highlight/README.md) | Plugin for highlighting code blocks |
| [`@prpl/plugin-css-imports`](packages/plugin-css-imports/README.md) | Plugin for resolving CSS imports |
| [`@prpl/plugin-html-imports`](packages/plugin-html-imports/README.md) | Plugin for resolving HTML imports |
| [`@prpl/plugin-rss`](packages/plugin-rss/README.md) | Plugin for generating RSS feeds |
| [`@prpl/plugin-sitemap`](packages/plugin-sitemap/README.md) | Plugin for generating a sitemap |

- `@prpl/core` is the only required module for a site to interpolate content into HTML, others are optional
- `@prpl/server` is easily replaced with other local development servers, you're not married to it if you use PRPL
- Most modules have zero dependencies, and those that do have the fewest number practical

## Development

Commands for developing PRPL modules.

- `npm run boostrap` to install local module dependencies
- `PACKAGE=[PACKAGE-NAME] npm run dev` from the project root to run an individual package in watch mode, e.g.
  `PACKAGE=core npm run dev` to run the core module
- `npm link` from the package root to symlink the local module globally
- `npm link @prpl/[PACKAGE-NAME]` from your project root to symlink to the globally linked module, e.g. `npm link
  @prpl/core` to link core
- `npm unlink @prpl/[PACKAGE-NAME]` from your project root to undo the global symlink, e.g. `npm unlink @prpl/core`
  to unlink core
- `npm unlink -g` from the package root to unlink the package
- `npm ls -g --depth=0 --link=true` to list all linked modules

## Testing

Tooling, CI and commands for testing PRPL modules.

- All modules are tested with [Cypress](https://www.cypress.io)
- Tests run in continuous integration via [GitHub Actions](https://github.com/features/actions) when new PRs are
  opened or changes are made to the branch the PR is opened from
- All modules are tested using both the CommonJS and ESM interfaces

To run tests locally:

- Navigate to the `tests/test-site` directory
- `npm install` to install dependencies for the test site
- `npm run dev:cjs` or `npm run dev:mjs` to run the local development server
- `npm run test:open` to open Cypress and select which test suites to run

## Publishing

Tooling and commands for publishing PRPL modules.

This repo is a monorepo orchestrated with [Lerna](https://lerna.js.org).

Before a new release is created with Lerna:

- A newly created package must be published initially with `npm publish --access public` in the package root
- All local changes must be committed first
- The branch must be pushed to remote

To create a new release with Lerna:

- `npm run release:changed` from the project root and follow the prompts