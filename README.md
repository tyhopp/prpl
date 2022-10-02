# PRPL

PRPL is a **lightweight** library for building **fast** static sites. It does two things:

- Interpolate your content into HTML files
- Maximize your site's runtime speed with the [PRPL pattern](https://web.dev/apply-instant-loading-with-prpl/)

## Features

- Tiny HTML-based API
- Zero configuration
- Zero or near-zero module dependencies
- CLI, CJS and ESM module interfaces
- Define your own template syntax
- Ship no client JavaScript
- Works on Linux, MacOS and Windows

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

PRPL requires [Node](https://nodejs.org/en/) [LTS or greater](https://nodejs.org/en/about/releases/).

To clone the minimal starter and run it locally, run:

```
npx -y create-prpl@latest
```

Visit [prpl.dev](https://prpl.dev) for full documentation, guides and design decisions.