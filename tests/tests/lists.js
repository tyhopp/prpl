import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { buildSite } from '../utils/build-site.js';
import { constructDOM } from '../utils/construct-dom.js';

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

let document;

test.before(async () => {
  await buildSite('core');
  const { document: notesDocument } = await constructDOM({ src: 'core/dist/notes.html' });
  document = notesDocument;
});

test('should interpolate templates', () => {
  assert.is(
    document.querySelector(`[data-cy=list-item-${page.a.id}-slug]`).getAttribute('href'),
    page.a.slug
  );
  assert.is(
    document.querySelector(`[data-cy=list-item-${page.a.id}-title]`).textContent,
    page.a.title
  );
  assert.is(
    document.querySelector(`[data-cy=list-item-${page.a.id}-description]`).textContent,
    page.a.description
  );
  assert.is(
    document.querySelector(`[data-cy=list-item-${page.a.id}-date]`).textContent,
    page.a.date
  );

  assert.is(
    document.querySelector(`[data-cy=list-item-${page.b.id}-slug]`).getAttribute('href'),
    page.b.slug
  );
  assert.is(
    document.querySelector(`[data-cy=list-item-${page.b.id}-title]`).textContent,
    page.b.title
  );
  assert.is(
    document.querySelector(`[data-cy=list-item-${page.b.id}-description]`).textContent,
    page.b.description
  );
  assert.is(
    document.querySelector(`[data-cy=list-item-${page.b.id}-date]`).textContent,
    page.b.date
  );
});

test('should render non template markup as is', () => {
  assert.is(
    document.querySelector(`[data-cy=list-item-${page.a.id}-other]`).textContent,
    page.a.other
  );
  assert.is(
    document.querySelector(`[data-cy=list-item-${page.b.id}-other]`).textContent,
    page.b.other
  );
});

test.run();
