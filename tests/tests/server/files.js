import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { constructDOM } from '../../utils/construct-dom.js';
import { constructCSSOM } from '../../utils/construct-cssom.js';
import { fetch } from '../../utils/fetch.js';
import { listenForChange } from '../../utils/listen-for-change.js';
import { writeSiteFile } from '../../utils/write-site-file.js';
import { readFile, writeFile } from 'fs/promises';
import { resolve } from 'path';

let currentModified;

test.before(async () => {
  const { lastModified } = await fetch('/');
  currentModified = lastModified;
});

const files = { 'index.html': null, 'index.css': null, 'index.js': null };

test.before.each(async () => {
  for (const file in files) {
    files[file] = await readFile(resolve(`sites/server/src/${file}`));
  }
});

test.after.each(async () => {
  for (const file in files) {
    await writeFile(resolve(`sites/server/src/${file}`), files[file]);
    files[file] = null;
  }
});

const edited = 'I was edited and reloaded by PRPL server';

test('should update if a source HTML file is changed', async () => {
  const file = 'index.html';

  const { document: srcDom } = await constructDOM({ src: `server/src/${file}` });
  srcDom.querySelector('h1').textContent = edited;
  await writeSiteFile({ target: `server/src/${file}`, om: srcDom });

  const { changed, data: html } = await listenForChange('/', currentModified);
  assert.ok(changed);

  const { document: serverDom } = await constructDOM({ src: html, type: 'string' });
  assert.equal(serverDom.querySelector('h1').textContent, edited);
});

test('should update if a source CSS file is changed', async () => {
  const file = 'index.css';
  const color = 'blue';
  const cssRule = `h1 {color: ${color} !important;}`;

  const srcCssom = await constructCSSOM({ src: `server/src/${file}` });
  srcCssom.insertRule(cssRule);
  await writeSiteFile({ target: `server/src/${file}`, om: srcCssom, type: 'css' });

  const { changed, data: css } = await listenForChange(`/${file}`, currentModified);
  assert.ok(changed);

  const serverCssom = await constructCSSOM({ src: css, type: 'string' });
  const [editedServerRule] = serverCssom.cssRules;
  assert.equal(editedServerRule.cssText, cssRule);
});

test('should update if a source JS file is changed', async () => {
  const file = 'index.js';
  const contents = `document.querySelector('p').textContent = 'I was updated by JavaScript twice';`;

  await writeFile(resolve(`sites/server/src/${file}`), contents);

  const { changed, data: js } = await listenForChange(`/${file}`, currentModified);
  assert.ok(changed);
  assert.equal(js, contents);
});

test.run();
