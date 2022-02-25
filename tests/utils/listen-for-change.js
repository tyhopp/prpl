import { fetch } from './fetch.js';

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function listenForChange(filePath, currentModified) {
  let changedAt;
  let changed = false;

  for (let i = 0; i < 30; i++) {
    const { lastModified } = await fetch(filePath);

    if (currentModified !== lastModified) {
      changedAt = lastModified;
      changed = true;
      break;
    }

    await wait(100);
  }

  return { changed, changedAt };
}

export { listenForChange };
