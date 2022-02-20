import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { constructDOM } from '../../utils/construct-dom.js';

const page = {
  a: {
    id: 'a',
    slug: 'notes/a',
    title: 'A',
    description: 'A description',
    date: '2020-01-01',
    other: 'Misc'
  },
  b: {
    id: 'b',
    slug: 'notes/b',
    title: 'B',
    description: 'B description',
    date: '2020-01-02',
    other: 'Misc'
  }
};

let dom;

test.before(async () => {
  dom = await constructDOM('notes.html');
});

test('should interpolate templates', () => {
  assert.is(
    dom.document.querySelector(`[data-cy=list-item-${page.a.id}-slug]`).getAttribute('href'),
    page.a.slug
  );
  assert.is(
    dom.document.querySelector(`[data-cy=list-item-${page.a.id}-title]`).textContent,
    page.a.title
  );
  assert.is(
    dom.document.querySelector(`[data-cy=list-item-${page.a.id}-description]`).textContent,
    page.a.description
  );
  assert.is(
    dom.document.querySelector(`[data-cy=list-item-${page.a.id}-date]`).textContent,
    page.a.date
  );

  assert.is(
    dom.document.querySelector(`[data-cy=list-item-${page.b.id}-slug]`).getAttribute('href'),
    page.b.slug
  );
  assert.is(
    dom.document.querySelector(`[data-cy=list-item-${page.b.id}-title]`).textContent,
    page.b.title
  );
  assert.is(
    dom.document.querySelector(`[data-cy=list-item-${page.b.id}-description]`).textContent,
    page.b.description
  );
  assert.is(
    dom.document.querySelector(`[data-cy=list-item-${page.b.id}-date]`).textContent,
    page.b.date
  );
});

test('should render non template markup as is', () => {
  assert.is(
    dom.document.querySelector(`[data-cy=list-item-${page.a.id}-other]`).textContent,
    page.a.other
  );
  assert.is(
    dom.document.querySelector(`[data-cy=list-item-${page.b.id}-other]`).textContent,
    page.b.other
  );
});

test.run();