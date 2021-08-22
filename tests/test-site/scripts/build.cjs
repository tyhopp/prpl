const { interpolate } = require('@prpl/core');
const { resolveHTMLImports } = require('@prpl/plugin-html-imports');
const { resolveCSSImports } = require('@prpl/plugin-css-imports');
const { highlightCode } = require('@prpl/plugin-code-highlight');
const { generateRSSFeed } = require('@prpl/plugin-rss');
const { generateSitemap } = require('@prpl/plugin-sitemap');

// Default options
const options = {
  noClientJS: false,
  templateRegex: (key) => new RegExp(`\\[${key}\\]`, 'g'),
  markedOptions: {}
};

async function build() {
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
}

build();
