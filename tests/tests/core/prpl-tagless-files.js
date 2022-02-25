import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { constructDOM } from '../../utils/construct-dom.js';

let document;

test.before(async () => {
  document = await constructDOM('core/dist/index.html');
});

test('should be copied without interpolation', () => {
  assert.is(document.querySelector('h1').textContent, 'PRPL Test Site');
});

test.run();
