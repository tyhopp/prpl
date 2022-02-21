import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { constructDOM } from '../../utils/construct-dom.js';

const origin = 'http://localhost:8000';

const slugs = {
  notes: 'notes',
  noteA: 'notes/a',
  noteB: 'notes/b',
  pluginCSSImports: 'plugin-css-imports',
  pluginHTMLimports: 'plugin-html-imports'
};

let document;

test.before(async () => {
  document = await constructDOM('dist/sitemap.xml', 'text/xml');
});

test('should output a list of urls', () => {
  const urls = Array.from(document.querySelectorAll('urlset > url')).reduce((acc, curr) => {
    const uri = curr.querySelector('loc').textContent;
    acc[uri] = uri;
    return acc;
  }, {});

  for (const slug in slugs) {
    assert.equal(urls[`${origin}/${slugs[slug]}`], `${origin}/${slugs[slug]}`);
  }
});

test.run();
