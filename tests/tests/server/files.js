import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { constructDOM } from '../../utils/construct-dom.js';
import { fetch } from '../../utils/fetch.js';
import { listenForChange } from '../../utils/listen-for-change.js';
import { writeSiteFile } from '../../utils/write-site-file.js';

let currentModified;

test.before(async () => {
  const { lastModified } = await fetch('/');
  currentModified = lastModified;
});

const edited = 'I was edited and reloaded by PRPL server';

test('should update if a source HTML file is changed', async () => {
  const route = 'server-file';
  const file = `${route}.html`;

  const srcDom = await constructDOM(`server/src/${file}`);
  srcDom.querySelector('h1').textContent = edited;
  await writeSiteFile(`src/${file}`, srcDom);

  const { changed } = await listenForChange(`/${route}`, currentModified);
  assert.ok(changed);

  const distDom = await constructDOM(`server/dist/${file}`);
  assert.equal(distDom.querySelector('h1').textContent, edited);
});

test.run();
