<!--
title: Guides
description: Guides for PRPL, a modular static site generator built for longevity.
slug: /guides
order: 05
-->

# Guides

PRPL keeps the amount of magic to a minimum, but there are naturally some aspects of PRPL's
functionality that could use more explanation. This page describes concepts and strategies that can be useful when
building with PRPL.

## Leveraging HTML with PRPL

### The main tag

PRPL expects one more DOM element to exist in a page aside from your typical head and body tags: `<main>`. A basic page should look something like this:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Hello world</title>
  </head>
  <body>
    <main>
      <h1>Hello world</h1>
    </main>
  </body>
</html>
```

The reason for this addition is so that PRPL has a target for what to diff in the body of the page when you navigate
from one page to the next. This allows you to put elements outside `<main>` but within `<body>`, and have those DOM
elements persisted between page renders.

For example, to persist a navigation menu, we can position a `<nav>` like this:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Hello world</title>
  </head>
  <body>
    <nav>
      <ul>
        <li>
          <a href="page-2">Page 2</a>
        </li>
        <li>
          <a href="page-3">Page 3</a>
        </li>
      </ul>
    </nav>
    <main>
      <h1>Hello world</h1>
    </main>
  </body>
</html>
```

By employing this strategy, `<nav>` will not rerender when you navigate between pages. This offers a great amount of
flexibility and opportunity to optimise for performance.

### The base tag

PRPL's DOM diffing algorithm uses the [`Node.isEqualNode()`](https://developer.mozilla.org/en-US/docs/Web/API/Node/isEqualNode)
web API to determine which DOM nodes will persist in the `<head>` during navigation.

Given this approach, if two pages in your site at different positions in the file system both request the same
resource, the requesting DOM nodes are removed and added back to the DOM due to differences in
the element's `src` or `href` paths. For example:

Given page A at `src/index.html`:

```html
<html lang="en">
  <head>
    <title>Page A</title>
    <link href="index.css" rel="stylesheet" />
  </head>
  <body>
    <main>
      <h1>Page A</h1>
    </main>
  </body>
</html>
```

and page B at `src/notes/index.html`:

```html
<html lang="en">
  <head>
    <title>Page B</title>
    <link href="../index.css" rel="stylesheet" />
  </head>
  <body>
    <main>
      <h1>Page B</h1>
    </main>
  </body>
</html>
```

The `<link>` will be removed and added back to the page when a user navigates between Page A and Page B because the
value of `href` does not match.

One way to optimize this is to use the [`<base>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base)
DOM node. By setting a base tag to the root of the site, all urls are treated as relative to that base. This allows
us to use the same exact `<link>` in both pages, letting the element persist in `<head>` between page renders.

The result looks like this, with page A:

```html
<html lang="en">
  <head>
    <base href="/" />
    <title>Page A</title>
    <link href="index.css" rel="stylesheet" />
  </head>
  <body>
    <main>
      <h1>Page A</h1>
    </main>
  </body>
</html>
```

and page B:

```html
<html lang="en">
  <head>
    <base href="/" />
    <title>Page B</title>
    <link href="index.css" rel="stylesheet" />
  </head>
  <body>
    <main>
      <h1>Page B</h1>
    </main>
  </body>
</html>
```

## The file system as a CMS

PRPL considers the file system as the basic data structure for input and output. This is reflected in the
[`generateFileSystemTree`](https://github.com/tyhopp/prpl/blob/main/packages/core/src/lib/generate-fs-tree.ts)
library function, used to construct in-memory representations of the `src` and `content` directories in your
site. This means that:

If you want to store your files somewhere else like AWS S3, you can do that by pulling down the files you want
to interpolate with PRPL to the `src` or `content` directories prior to running [`interpolate`](https://github.com/tyhopp/prpl/blob/main/packages/core/src/interpolate/interpolate.ts)
.

If you want to process files further after running [`interpolate`](https://github.com/tyhopp/prpl/blob/main/packages/core/src/interpolate/interpolate.ts)
, you can access the `dist` directory where PRPL outputs interpolated files.

PRPL's orientation around the file system avoids introducing concepts that are less familiar and less ubiquitous, while
also aligning with the browser and providing a high degree of predictability. In short, PRPL relies heavily on the
file system, which you might consider the original CMS.

## Custom build scripts

Given PRPL's orientation around the file system and modular exported functions, custom build scripts are easily
composed. As long as you are aware that PRPL accesses `src` and `content` and writes to `dist`, everything else is up to you.

For example, this is the build script for [my personal website](https://tyhopp.com):

```javascript
import { interpolate } from '@prpl/core';
import { resolveHTMLImports } from '@prpl/plugin-html-imports';
import { resolveCSSImports } from '@prpl/plugin-css-imports';
import { highlightCode } from '@prpl/plugin-code-highlight';
import { generateRSSFeed } from '@prpl/plugin-rss';
import { generateSitemap } from '@prpl/plugin-sitemap';

await interpolate();
await resolveHTMLImports();
await resolveCSSImports();
await highlightCode();

const origin = 'https://tyhopp.com';

await generateRSSFeed({
  dir: 'content/notes',
  feedTitle: `Ty Hopp's Feed`,
  author: 'Ty Hopp',
  origin
});

await generateSitemap({
  origin,
  ignoreDirRegex: new RegExp('dist/fragments')
});
```

As you can see, I have complete control over what happens at what point in the build process. This is possible
because of PRPL's focus on [functions, not configuration](/design-decisions#functions-not-configuration).

---

See [design decisions](/design-decisions) next.
