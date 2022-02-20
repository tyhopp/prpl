import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { constructDOM } from '../../utils/construct-dom.js';

const page = {
  a: {
    id: 'a',
    title: 'A',
    date: '2020-01-01',
    body: 'A body',
    other: 'Misc'
  },
  b: {
    id: 'b',
    title: 'B',
    date: '2020-01-02',
    body: 'B body',
    other: 'Misc'
  }
};

const dom = {};

test.before(async () => {
  dom.a = await constructDOM('notes/a.html');
  dom.b = await constructDOM('notes/b.html');
});

test('should interpolate templates', () => {
  assert.is(dom.a.document.querySelector('[data-cy=page-meta-title]').textContent, page.a.title);
  assert.is(dom.a.document.querySelector('[data-cy=page-title]').textContent, page.a.title);
  assert.is(dom.a.document.querySelector('[data-cy=page-date]').textContent, page.a.date);
  assert.is(dom.a.document.querySelector('[data-cy=page-body] > p').textContent, page.a.body);

  assert.is(dom.b.document.querySelector('[data-cy=page-meta-title]').textContent, page.b.title);
  assert.is(dom.b.document.querySelector('[data-cy=page-title]').textContent, page.b.title);
  assert.is(dom.b.document.querySelector('[data-cy=page-date]').textContent, page.b.date);
  assert.is(dom.b.document.querySelector('[data-cy=page-body] > p').textContent, page.b.body);
});

test('should render non template markup as is', () => {
  assert.is(dom.a.document.querySelector('[data-cy=page-other]').textContent, page.a.other);
  assert.is(dom.b.document.querySelector('[data-cy=page-other]').textContent, page.b.other);
});

test.run();
