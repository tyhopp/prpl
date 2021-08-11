import { resolve } from 'path';
import { interpolate, PRPLCachePartitionKey } from '@prpl/core';
import { createCachePartition } from '@prpl/plugin-cache';
import { resolveHTMLImports } from '@prpl/plugin-html-imports';
import { resolveCSSImports } from '@prpl/plugin-css-imports';
import { highlightCode } from '@prpl/plugin-code-highlight';
import { generateRSSFeed } from '@prpl/plugin-rss';
import { generateSitemap } from '@prpl/plugin-sitemap';

// Default options
const options = {
  noClientJS: false,
  templateRegex: (key) => new RegExp(`\\[${key}\\]`, 'g'),
  markedOptions: {}
};

await interpolate({ options });

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

await highlightCode({
  cachePartitionKey: PRPLCachePartitionKey.dist
});

const origin = 'http://localhost:8000';

await generateRSSFeed({
  dir: 'content/notes',
  feedTitle: 'Test feed',
  author: 'Ty Hopp',
  origin
});

await generateSitemap({
  origin,
  ignoreDirRegex: new RegExp('dist/fragments'),
  cachePartitionKey: PRPLCachePartitionKey.dist
});
