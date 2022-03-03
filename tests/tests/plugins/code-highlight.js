import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { constructDOM } from '../../utils/construct-dom.js';

let document;

test.before(async () => {
  const { document: codeHighlightDocument } = await constructDOM({
    src: 'plugins/dist/plugin-code-highlight.html'
  });
  document = codeHighlightDocument;
});

test('should highlight code blocks', () => {
  assert.ok(document.querySelector('pre > code > span[class*=hljs]'));
});

test('should highlight inline code', () => {
  assert.ok(document.querySelector('pre > code > span[class*=hljs]'));
});

test.run();
