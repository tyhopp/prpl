import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { constructDOMFromFile } from '../../utils/construct-dom.js';

let document;

test.before(async () => {
  document = await constructDOMFromFile('plugins/dist/plugin-code-highlight.html');
});

test('should highlight code blocks', () => {
  assert.ok(document.querySelector('pre > code > span[class*=hljs]'));
});

test('should highlight inline code', () => {
  assert.ok(document.querySelector('pre > code > span[class*=hljs]'));
});

test.run();
