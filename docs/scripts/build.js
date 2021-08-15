import { interpolate } from '@prpl/core';
import { resolveHTMLImports } from '@prpl/plugin-html-imports';
import { resolveCSSImports } from '@prpl/plugin-css-imports';
import { highlightCode } from '@prpl/plugin-code-highlight';
import { generateSitemap } from '@prpl/plugin-sitemap';

await interpolate();
await resolveHTMLImports();
await resolveCSSImports();
await highlightCode();
await generateSitemap({
  origin: 'https://prpl.dev',
  ignoreDirRegex: new RegExp('dist/fragments')
});
