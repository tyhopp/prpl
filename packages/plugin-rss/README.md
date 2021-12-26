# @prpl/plugin-rss

A plugin for [PRPL](https://github.com/tyhopp/prpl) that generates [Atom feeds](https://en.wikipedia.org/wiki/Atom_
(Web_standard)).

### Dependencies

`@prpl/plugin-rss` has zero dependencies.

### Functions

[`generateRSSFeed`](https://github.com/tyhopp/prpl/tree/main/packages/plugin-rss/src/index.ts) is the only export. See [the source code](https://github.com/tyhopp/prpl/tree/main/packages/plugin-rss/src/index.ts) for its signature.

### Usage

```javascript
import { interpolate } from '@prpl/core';
import { generateRSSFeed } from '@prpl/plugin-rss';

await interpolate();
await generateRSSFeed({
  dir: 'content/notes',
  feedTitle: `Ty Hopp's Feed`,
  author: 'Ty Hopp',
  origin: 'https://tyhopp.com'
});
```