import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { constructDOM } from '../../utils/construct-dom.js';

const feedTitle = 'Test feed';
const author = 'Ty Hopp';
const origin = 'http://localhost:8000';

const { a, b } = {
  a: {
    title: 'A',
    slug: 'notes/a',
    date: '2020-01-01',
    description: 'A description'
  },
  b: {
    title: 'B',
    slug: 'notes/b',
    date: '2020-01-02',
    description: 'B description'
  }
};

let document;

test.before(async () => {
  const { document: rssDocument } = await constructDOM({
    src: 'plugins/dist/rss.xml',
    mimeType: 'text/xml'
  });
  document = rssDocument;
});

test('should output a feed title', () => {
  assert.equal(document.querySelector('feed > title').textContent, feedTitle);
});

test('should output an alternate link', () => {
  assert.equal(document.querySelector('feed > link').getAttribute('href'), origin);
});

test('should output a last updated timestamp', () => {
  const updatedDateTimestamp = Date.parse(document.querySelector('feed > updated').textContent);

  assert.ok(updatedDateTimestamp > 0);
  assert.ok(updatedDateTimestamp < Date.now());
});

test('should output an author name', () => {
  assert.equal(document.querySelector('feed > author > name').textContent, author);
});

test('should output multiple entries', () => {
  assert.equal(document.querySelectorAll('feed > entry').length, 2);
});

// All queries for entries should yield entry B before A given entry B's date is more recent.
// This is tested implicitly in the below tests.

test('should output entry ids', () => {
  const [entryB, entryA] = document.querySelectorAll('feed > entry');

  assert.equal(entryA.querySelector('id').textContent, `${origin}/${a.slug}`);
  assert.equal(entryB.querySelector('id').textContent, `${origin}/${b.slug}`);
});

test('should output entry published timestamps', () => {
  const [entryB, entryA] = document.querySelectorAll('feed > entry');

  const dateA = new Date(a.date);
  const isoDateA = dateA?.toISOString();

  const dateB = new Date(b.date);
  const isoDateB = dateB?.toISOString();

  assert.equal(entryA.querySelector('published').textContent, isoDateA);
  assert.equal(entryB.querySelector('published').textContent, isoDateB);
});

test('should output entry updated timestamps', () => {
  const [entryB, entryA] = document.querySelectorAll('feed > entry');

  const dateA = new Date(a.date);
  const isoDateA = dateA?.toISOString();

  const dateB = new Date(b.date);
  const isoDateB = dateB?.toISOString();

  assert.equal(entryA.querySelector('updated').textContent, isoDateA);
  assert.equal(entryB.querySelector('updated').textContent, isoDateB);
});

test('should output entry titles', () => {
  const [entryB, entryA] = document.querySelectorAll('feed > entry');

  assert.equal(entryA.querySelector('title').textContent, a.title);
  assert.equal(entryB.querySelector('title').textContent, b.title);
});

test('should output entry alternate links', () => {
  const [entryB, entryA] = document.querySelectorAll('feed > entry');

  assert.equal(entryA.querySelector('link').getAttribute('href'), `${origin}/${a.slug}`);
  assert.equal(entryB.querySelector('link').getAttribute('href'), `${origin}/${b.slug}`);
});

test('should output entry authors', () => {
  const [entryB, entryA] = document.querySelectorAll('feed > entry');

  assert.equal(entryA.querySelector('author > name').textContent, author);
  assert.equal(entryB.querySelector('author > name').textContent, author);
});

test('should output entry summaries', () => {
  const [entryB, entryA] = document.querySelectorAll('feed > entry');

  assert.equal(entryA.querySelector('summary').textContent, a.description);
  assert.equal(entryB.querySelector('summary').textContent, b.description);
});

test('should output entry content links', () => {
  const [entryB, entryA] = document.querySelectorAll('feed > entry');

  assert.equal(entryA.querySelector('content').getAttribute('src'), `${origin}/${a.slug}`);
  assert.equal(entryB.querySelector('content').getAttribute('src'), `${origin}/${b.slug}`);
});

test.run();
