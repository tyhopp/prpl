# @prpl/plugin-css-imports

A plugin for [PRPL](https://github.com/tyhopp/prpl) that resolves CSS import statements at build time. Useful to 
avoid extra requests at runtime for imported CSS files.

### Dependencies

`@prpl/plugin-css-imports` has zero dependencies.

### Functions

[`resolveCSSImports`](src/index.ts) is the only export. See [the source code](src/index.ts) for its signature.

### Usage

```javascript
import { interpolate } from '@prpl/core';
import { resolveCSSImports } from '@prpl/plugin-css-imports';

await interpolate();
await resolveCSSImports();
```

### Notes

Given CSS file `a.css`:

```css
@import 'b.css';

h1 {
  color: mediumslateblue;
}
```

and CSS file `b.css`:

```css
p {
  color: mediumslateblue;
}
```

and [`resolveCSSImports`](src/index.ts) is called, the output of CSS file `a.css` will be:

```css
p {
  color: mediumslateblue;
}

h1 {
  color: mediumslateblue;
}
```