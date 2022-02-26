import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { constructCSSOMFromFile } from '../../utils/construct-cssom.js';

let cssom;

test.before(async () => {
  cssom = await constructCSSOMFromFile('plugins/dist/plugin-css-imports.css');
});

test('should interpolate CSS imports', () => {
  const [firstRule, secondRule] = cssom.cssRules;
  assert.is(firstRule.selectorText, 'h1');
  assert.is(secondRule.selectorText, '.plugin-css-imports');
});

test.run();
