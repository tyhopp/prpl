<!--
title: Plugins
description: Plugin library reference of PRPL, a modular static site generator built for longevity.
slug: /plugins
order: 04
-->

# Plugins

PRPL has a library of official plugins offering common build time functionality not contained in [`@prpl/core`](https://github.com/tyhopp/prpl/tree/main/packages/core):

| Module                                                      | Description                         |
| ----------------------------------------------------------- | ----------------------------------- |
| [`@prpl/plugin-aws`](/plugins#aws)                          | Plugin for working with AWS S3      |
| [`@prpl/plugin-code-highlight`](/plugins#code-highlighting) | Plugin for highlighting code blocks |
| [`@prpl/plugin-css-imports`](/plugins#css-imports)          | Plugin for resolving CSS imports    |
| [`@prpl/plugin-html-imports`](/plugins#html-imports)        | Plugin for resolving HTML imports   |
| [`@prpl/plugin-rss`](/plugins#rss)                          | Plugin for generating RSS feeds     |
| [`@prpl/plugin-sitemap`](/plugins#sitemap)                  | Plugin for generating a sitemap     |

This page contains links to each plugin's source code, a brief description, as well as notes on dependencies (if any)
and exported functions.

---

## AWS

[`@prpl/plugin-aws`](https://github.com/tyhopp/prpl/tree/main/packages/plugin-aws) is a plugin for working with [AWS S3](https://aws.amazon.com/s3/). Useful if
you would rather have your content files stored in S3 instead of checked in under version control.

Relies on one dependency, [`aws-sdk`](https://github.com/aws/aws-sdk-js).

Exported functions:

| Name                                                                                               | Description                                                        |
| -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| [`fetchFromS3`](https://github.com/tyhopp/prpl/tree/main/packages/plugin-aws/src/fetch-from-s3.ts) | Fetch file(s) from an S3 bucket and write to the local file system |
| [`uploadToS3`](https://github.com/tyhopp/prpl/tree/main/packages/plugin-aws/src/upload-to-s3.ts)   | Upload file(s) to an S3 bucket from the local file system          |

See [`@prpl/plugin-aws`](https://github.com/tyhopp/prpl/tree/main/packages/plugin-aws) for full usage and examples.

---

## Code highlighting

[`@prpl/plugin-code-highlight`](https://github.com/tyhopp/prpl/tree/main/packages/plugin-code-highlight) highlights code blocks with [Highlight.js](https://github.com/highlightjs/highlight.js).

Relies on two dependencies, [highlight.js](https://github.com/highlightjs/highlight.js) and
[html-escaper](https://github.com/WebReflection/html-escaper).

[`highlightCode`](https://github.com/tyhopp/prpl/tree/main/packages/plugin-code-highlight/src/index.ts) is the
only exported function. See the [source code](https://github.com/tyhopp/prpl/tree/main/packages/plugin-code-highlight/src/index.ts) for its signature.

See [`@prpl/plugin-code-highlight`](https://github.com/tyhopp/prpl/tree/main/packages/plugin-code-highlight) for full usage and examples.

---

## CSS imports

[`@prpl/plugin-css-imports`](https://github.com/tyhopp/prpl/tree/main/packages/plugin-css-imports) resolves [CSS import statements](https://developer.mozilla.org/en-US/docs/Web/CSS/@import) at build time. Useful to avoid extra
requests at runtime for imported CSS files.

Relies on zero dependencies.

[`resolveCSSImports`](https://github.com/tyhopp/prpl/tree/main/packages/plugin-css-imports/src/index.ts) is the
only exported function. See the [source code](https://github.com/tyhopp/prpl/tree/main/packages/plugin-css-imports/src/index.ts) for its signature.

See [`@prpl/plugin-css-imports`](https://github.com/tyhopp/prpl/tree/main/packages/plugin-css-imports) for full
usage and examples.

---

## HTML imports

[`@prpl/plugin-html-imports`](https://github.com/tyhopp/prpl/tree/main/packages/plugin-html-imports) resolves [HTML import statements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/HTML_Imports) at build time. Useful for reusing blocks of HTML in your source code and avoiding extra requests
at runtime.

Relies on zero dependencies.

[`resolveHTMLImports`](https://github.com/tyhopp/prpl/tree/main/packages/plugin-html-imports/src/index.ts) is the
only exported function. See the [source code](https://github.com/tyhopp/prpl/tree/main/packages/plugin-html-imports/src/index.ts) for its signature.

See [`@prpl/plugin-html-imports`](https://github.com/tyhopp/prpl/tree/main/packages/plugin-html-imports) for full
usage and examples.

---

## RSS

[`@prpl/plugin-rss`](https://github.com/tyhopp/prpl/tree/main/packages/plugin-rss) generates [Atom feeds](<https://en.wikipedia.org/wiki/Atom_(Web_standard)>).

Relies on zero dependencies.

[`generateRSSFeed`](https://github.com/tyhopp/prpl/tree/main/packages/plugin-rss/src/index.ts) is the
only exported function. See the [source code](https://github.com/tyhopp/prpl/tree/main/packages/plugin-rss/src/index.ts) for its signature.

See [`@prpl/plugin-rss`](https://github.com/tyhopp/prpl/tree/main/packages/plugin-rss) for full usage and examples.

---

## Sitemap

[`@prpl/plugin-sitemap`](https://github.com/tyhopp/prpl/tree/main/packages/plugin-sitemap) generates a sitemap.

Relies on zero dependencies.

[`generateSitemap`](https://github.com/tyhopp/prpl/tree/main/packages/plugin-sitemap/src/index.ts) is the
only exported function. See the [source code](https://github.com/tyhopp/prpl/tree/main/packages/plugin-sitemap/src/index.ts) for its signature.

See [`@prpl/plugin-sitemap`](https://github.com/tyhopp/prpl/tree/main/packages/plugin-sitemap) for full usage and examples.

---

See [guides](/guides) next.
