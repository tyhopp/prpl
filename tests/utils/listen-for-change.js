import { fetch } from './fetch.js';

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function listenForChange(filePath, currentModified) {
  let changedAt;
  let changed = false;
  let html;

  for (let i = 0; i < 30; i++) {
    const { data, lastModified } = await fetch(filePath);

    if (currentModified !== lastModified) {
      changedAt = lastModified;
      changed = true;
      html = data;
      break;
    }

    await wait(100);
  }

  return { changed, changedAt, html };
}

export { listenForChange };
