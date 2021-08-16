# @prpl/plugin-cache (WIP)

**NOTE - This plugin is experimental. It may change significantly in the future. Not recommended for use at present.**

A plugin for [PRPL](https://github.com/tyhopp/prpl) for cache manipulation. Useful for defining cache partitions that 
subsequent plugins may access.

### Dependencies

`@prpl/plugin-cache` has zero dependencies.

### Functions

[`createCachePartition`](src/index.ts) is the only export. See [the source code](src/index.ts) for its signature.

### Usage

For example, you may want to pre-define a partition that reads all HTML and CSS files in `dist` so that those files 
can be accessed in memory:

```javascript
import { resolve } from 'path';
import { interpolate, PRPLCachePartitionKey } from '@prpl/core';
import { createCachePartition } from '@prpl/plugin-cache';
import { resolveHTMLImports } from '@prpl/plugin-html-imports';
import { resolveCSSImports } from '@prpl/plugin-css-imports';

await interpolate();

// Pre-define dist partition and use for subsequent plugins
await createCachePartition({
  entityPath: resolve('dist'),
  partitionKey: PRPLCachePartitionKey.dist,
  readFileRegExp: new RegExp(`.html|.css`)
});

await resolveHTMLImports({
  cachePartitionKey: PRPLCachePartitionKey.dist
});

await resolveCSSImports({
  cachePartitionKey: PRPLCachePartitionKey.dist
});
```

By doing this, we save each plugin from generating its own partition that reads from the file system. All plugins 
that interact with the cache should return the cache as an artifact that can be conveniently inspected.