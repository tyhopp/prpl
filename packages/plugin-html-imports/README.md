# @prpl/plugin-html-imports

A plugin for [PRPL](https://github.com/tyhopp/prpl) that resolves HTML import statements at build time. Useful for 
reusing blocks of HTML in your source code and avoiding extra requests at runtime.

### Dependencies

`@prpl/plugin-html-imports` has zero dependencies.

### Functions

[`resolveHTMLImports`](src/index.ts) is the only export. See [the source code](src/index.ts) for its signature.

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

and [`resolveHTMLImports`](src/index.ts) is called, the output of HTML file `hello-world.html` will be:

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