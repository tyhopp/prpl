# @prpl/core

This module consists of four parts:

- Interpolation functions
- Library functions
- Client-side JavaScript files
- TypeScript types

### Dependencies

`@prpl/core` has one dependency: [`marked`](https://github.com/markedjs/marked), a markdown compiler. Reasons 
for relying on it include:

- It is not practical to implement a markdown compiler within the PRPL library
- It is fair to assume that most users will author content in markdown given its ubiquity  
- [`marked`](https://github.com/markedjs/marked) itself has zero dependencies and is actively maintained

In the future it may make sense to externalize this dependency, but given the above reasons it is included for now.

### Interpolation functions

Core functions that take source code as input, interpolate content as needed and output files for consumption in the 
browser. All functions have types and explicit comments in the source files so function signatures are omitted here.

| Function | Description |
| --- | --- |
| [`interpolate`](https://github.com/tyhopp/prpl/blob/main/packages/core/src/interpolate/interpolate.ts) | Entry point that recursively walks the source file system tree |
| [`interpolateHTML`](https://github.com/tyhopp/prpl/blob/main/packages/core/src/interpolate/interpolate-html.ts) | Interpolates an HTML file found in [`interpolate`](https://github.com/tyhopp/prpl/blob/main/packages/core/src/interpolate/interpolate.ts) |
| [`interpolateList`](https://github.com/tyhopp/prpl/blob/main/packages/core/src/interpolate/interpolate-list.ts) | Interpolates a `<prpl>` tag of type `list` |
| [`interpolatePage`](https://github.com/tyhopp/prpl/blob/main/packages/core/src/interpolate/interpolate-page.ts) | Interpolates a `<prpl>` tag of type `page` |
| [`parsePRPLAttributes`](https://github.com/tyhopp/prpl/blob/main/packages/core/src/interpolate/parse-prpl-attributes.ts) | Parses attributes of a `<prpl>` tag |
| [`parsePRPLMetadata`](https://github.com/tyhopp/prpl/blob/main/packages/core/src/interpolate/parse-prpl-metadata.ts) | Parses metadata at the top of each content file |
| [`transformMarkdown`](https://github.com/tyhopp/prpl/blob/main/packages/core/src/interpolate/transform-markdown.ts) | Transforms markdown into HTML |

### Library functions

A mix of extended builtin functions and PRPL-specific functions.

| Function | Description |
| --- | --- |
| [`cache`](https://github.com/tyhopp/prpl/tree/main/packages/core/src/lib/cache.ts) | In-memory cache that supports user-defined partitions |
| [`cwd`](https://github.com/tyhopp/prpl/tree/main/packages/core/src/lib/cwd.ts) | Calculates current working directory relative to the calling file |
| [`ensureDir`](https://github.com/tyhopp/prpl/tree/main/packages/core/src/lib/ensure-dir.ts) | Ensure a directory exists given an absolute path |
| [`ensureFile`](https://github.com/tyhopp/prpl/tree/main/packages/core/src/lib/ensure-file.ts) | Ensure a file exists given an absolute path |
| [`exists`](https://github.com/tyhopp/prpl/tree/main/packages/core/src/lib/exists.ts) | Check whether an entity exists given an absolute path |
| [`generateFileSystemTree`](https://github.com/tyhopp/prpl/tree/main/packages/core/src/lib/generate-fs-tree.ts) | Generates an object that represents a file system |
| [`generateOrRetrieveFileSystemTree`](https://github.com/tyhopp/prpl/tree/main/packages/core/src/lib/generate-or-retrieve-fs-tree.ts) | Retrieve a cached file system tree or generate and cache a new one |
| [`log`](https://github.com/tyhopp/prpl/tree/main/packages/core/src/lib/log.ts) | Console wrapper providing context and color |
| [`readDirSafe`](https://github.com/tyhopp/prpl/tree/main/packages/core/src/lib/read-dir-safe.ts) | Read only directories that have access permission |
| [`stat`](https://github.com/tyhopp/prpl/tree/main/packages/core/src/lib/stat.ts) | Wrapper around Node `stat` for Deno compatibility |

### Client-side JavaScript files

Unless the user opts-out via the options argument in [`interpolate`](https://github.com/tyhopp/prpl/blob/main/packages/core/src/interpolate/interpolate.ts), this module 
will include 3 small JavaScript files in the site to enable [the PRPL pattern](https://web.dev/apply-instant-loading-with-prpl/) at runtime.

| File | Description |
| --- | --- |
| [`prefetch`](https://github.com/tyhopp/prpl/tree/main/packages/core/src/client/prefetch.ts) | Schedule prefetch requests for links found in the current page |
| [`prefetchWorker`](https://github.com/tyhopp/prpl/tree/main/packages/core/src/client/prefetch-worker.ts) | Worker that executes prefetch requests off the main thread |
| [`router`](https://github.com/tyhopp/prpl/tree/main/packages/core/src/client/router.ts) | Router that serves prefetched HTML or gracefully degrades to browser-native routing |

### Types

TypeScript types that are used in all PRPL modules.

See [PRPL types](https://github.com/tyhopp/prpl/tree/main/packages/core/src/types/prpl.ts).