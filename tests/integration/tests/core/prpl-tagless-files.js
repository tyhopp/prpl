import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { constructDOM } from '../../utils/construct-dom.js';

let dom;

test.before(async () => {
  dom = await constructDOM('index.html');
});

test('should be copied without interpolation', () => {
  assert.is(dom.document.querySelector('h1').textContent, 'PRPL Test Site');
});

test.run();
