import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { constructDOM } from '../../utils/construct-dom.js';

const fragments = {
  a: {
    id: 'a',
    text: 'A fragment'
  },
  b: {
    id: 'b',
    text: 'B fragment'
  }
};

const { a, b } = fragments;

let dom;

test.before(async () => {
  dom = await constructDOM('plugin-html-imports.html');
});

test('should interpolate HTML imports', () => {
  assert.is(dom.document.querySelector(`[data-cy=fragment-${a.id}]`).textContent, a.text);
  assert.is(dom.document.querySelector(`[data-cy=fragment-${b.id}]`).textContent, b.text);
});

test.run();
