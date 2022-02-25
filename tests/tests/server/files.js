import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { constructDOMFromFile, constructDOMFromString } from '../../utils/construct-dom.js';
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

const files = { 'index.html': null, 'index.css': null };

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

  const srcDom = await constructDOMFromFile(`server/src/${file}`);
  srcDom.querySelector('h1').textContent = edited;
  await writeSiteFile(`server/src/${file}`, srcDom);

  const { changed, html } = await listenForChange('/', currentModified);
  assert.ok(changed);

  const serverDom = await constructDOMFromString(html);
  assert.equal(serverDom.querySelector('h1').textContent, edited);
});

test.run();
