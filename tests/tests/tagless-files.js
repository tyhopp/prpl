import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { buildSite } from '../utils/build-site.js';
import { constructDOM } from '../utils/construct-dom.js';

let document;

test.before(async () => {
  await buildSite('core');
  const { document: indexDocument } = await constructDOM({ src: 'core/dist/index.html' });
  document = indexDocument;
});

test('should be copied without interpolation', () => {
  assert.is(document.querySelector('h1').textContent, 'PRPL Test Site');
});

test.run();
