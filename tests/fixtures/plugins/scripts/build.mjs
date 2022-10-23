import { interpolate } from '@prpl/core';
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

await resolveHTMLImports();

await resolveCSSImports();

await highlightCode();

const origin = 'http://localhost:8000';

await generateRSSFeed({
  dir: 'content/notes',
  feedTitle: 'Test feed',
  author: 'Ty Hopp',
  origin
});

await generateSitemap({
  origin,
  ignoreDirRegex: new RegExp('dist/fragments')
});
