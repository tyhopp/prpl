import { fetch } from './fetch.js';

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function listenForChange(filePath, currentModified) {
  let changedAt;
  let changed = false;
  let html;

  for (let i = 0; i < 30; i++) {
    await wait(100);

    const { data, lastModified } = await fetch(filePath);

    if (currentModified !== lastModified) {
      changedAt = lastModified;
      changed = true;
      html = data;
      break;
    }
  }

  return { changed, changedAt, html };
}

export { listenForChange };
