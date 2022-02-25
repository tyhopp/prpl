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

let document;

test.before(async () => {
  document = await constructDOM('plugins/dist/plugin-html-imports.html');
});

test('should interpolate HTML imports', () => {
  assert.is(document.querySelector(`[data-cy=fragment-${a.id}]`).textContent, a.text);
  assert.is(document.querySelector(`[data-cy=fragment-${b.id}]`).textContent, b.text);
});

test.run();
