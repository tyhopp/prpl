import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { constructDOM } from '../../utils/construct-dom.js';

let dom;

test.before(async () => {
  dom = await constructDOM('plugin-code-highlight.html');
});

test('should highlight code blocks', () => {
  assert.ok(dom.document.querySelector('pre > code > span[class*=hljs]'));
});

test('should highlight inline code', () => {
  assert.ok(dom.document.querySelector('pre > code > span[class*=hljs]'));
});

test.run();
