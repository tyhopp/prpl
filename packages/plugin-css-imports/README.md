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

### Notes

This plugin should be disabled when using the PRPL dev server. The dev server is not yet aware of the graph of resources in your site and will not be able to detect changes in imported CSS files. There should be no difference in behavior given the [CSS at-rule](https://caniuse.com/?search=css%20import) is supported in all modern browsers.