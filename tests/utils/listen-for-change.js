import { fetch } from './fetch.js';
import { wait } from './wait.js';

async function listenForChange(filePath, currentModified) {
  let changedAt;
  let changed = false;
  let data;

  for (let i = 0; i < 30; i++) {
    await wait(100);

    const { data: fetchedData, lastModified } = await fetch(filePath);

    if (currentModified !== lastModified) {
      changedAt = lastModified;
      changed = true;
      data = fetchedData;
      break;
    }
  }

  return { changed, changedAt, data };
}

export { listenForChange };
