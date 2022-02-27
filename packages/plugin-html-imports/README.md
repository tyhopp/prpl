# @prpl/plugin-html-imports

A plugin for [PRPL](https://github.com/tyhopp/prpl) that resolves HTML import statements at build time.

The PRPL dev server is not yet aware of the graph of resources in your site and will not be able to detect changes in imported HTML files. Given that [HTML imports](https://caniuse.com/?search=html%20import) is a deprecated specification, it's recommended to only use this plugin for fragments of HTML that you do not need live reloads of during development (for example, meta tags).

## Dependencies

`@prpl/plugin-html-imports` has zero dependencies.

### Usage

```javascript
import { interpolate } from '@prpl/core';
import { resolveHTMLImports } from '@prpl/plugin-html-imports';

await interpolate();
await resolveHTMLImports();
```

### Notes

Given HTML file `hello-world.html`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <base href="/" />
    <link rel="import" href="meta.html" />
    <title>Hello world</title>
  </head>
  <body>
    <main class="index">
      <h1>Hello world</h1>
    </main>
  </body>
</html>
```

and an HTML fragment `meta.html`:

```html
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
```

and [`resolveHTMLImports`](https://github.com/tyhopp/prpl/tree/main/packages/plugin-html-imports/src/index.ts) is called, the output of HTML file `hello-world.html` will be:

```html
<html lang="en">
  <head>
    <base href="/" />
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <title>Hello world</title>
  </head>
  <body>
    <main class="index">
      <h1>Hello world</h1>
    </main>
  </body>
</html>
```