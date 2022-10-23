import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { buildSite } from '../utils/build-site.js';
import { constructDOM } from '../utils/construct-dom.js';

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

const document = {};

test.before(async () => {
  await buildSite('core');
  const { document: documentA } = await constructDOM({ src: 'core/dist/notes/a.html' });
  const { document: documentB } = await constructDOM({ src: 'core/dist/notes/b.html' });
  document.a = documentA;
  document.b = documentB;
});

test('should interpolate templates', () => {
  assert.is(document.a.querySelector('[data-cy=page-meta-title]').textContent, page.a.title);
  assert.is(document.a.querySelector('[data-cy=page-title]').textContent, page.a.title);
  assert.is(document.a.querySelector('[data-cy=page-date]').textContent, page.a.date);
  assert.is(document.a.querySelector('[data-cy=page-body] > p').textContent, page.a.body);

  assert.is(document.b.querySelector('[data-cy=page-meta-title]').textContent, page.b.title);
  assert.is(document.b.querySelector('[data-cy=page-title]').textContent, page.b.title);
  assert.is(document.b.querySelector('[data-cy=page-date]').textContent, page.b.date);
  assert.is(document.b.querySelector('[data-cy=page-body] > p').textContent, page.b.body);
});

test('should render non template markup as is', () => {
  assert.is(document.a.querySelector('[data-cy=page-other]').textContent, page.a.other);
  assert.is(document.b.querySelector('[data-cy=page-other]').textContent, page.b.other);
});

test.run();
