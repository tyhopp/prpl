import { clear, get, set, entries, setMany } from 'idb-keyval';

/**
 * Web worker that receives a set of page paths to prefetch data for if the paths are not yet cached.
 *
 * The context variable notifies TS that the context is Worker, not Window.
 * @see {@link https://stackoverflow.com/questions/50402004/error-ts2554-expected-2-3-arguments-but-got-1/50420456#50420456}
 *
 * This file deliberately does not import any types because TypeScript will treat this file as a module and emit an empty export
 * declaration at the end of this file. Since modules in web workers are not supported in all browsers, this would break.
 * @see {@link https://github.com/microsoft/TypeScript/issues/41567}
 */

async function handleCacheInvalidation(buildId: string) {
  const currentBuildId = await get('prpl-build-id');
  if (!currentBuildId || currentBuildId !== buildId) {
    await clear();
    await set('prpl-build-id', buildId);
  }
}

async function identifyUncachedPaths(paths: string[]): Promise<string[]> {
  const cachedEntries = await entries();
  const cachedEntriesMap = new Map(cachedEntries);
  const newEntries: string[] = [];

  for (const path of paths) {
    if (!cachedEntriesMap.get(`prpl-${path}`)) {
      newEntries.push(path);
    }
  }

  return newEntries;
}

async function createPrefetch(link: string): Promise<[IDBValidKey, string]> {
  try {
    const response = await fetch(link);
    const html = await response?.text();
    return [`prpl-${link}`, html];
  } catch (error) {
    console.warn('[PRPL] Failed to prefetch page.', error);
  }
}

interface Message {
  paths: string[];
  buildId: string;
}

onmessage = async function (event: MessageEvent<Message>): Promise<void> {
  try {
    const { paths, buildId } = event?.data;

    await handleCacheInvalidation(buildId);

    // Identify which paths are not in the cache yet
    const uncachedPaths = await identifyUncachedPaths(paths);

    // If no uncached paths, our work is done here
    if (!uncachedPaths.length) {
      return;
    }

    // Create array of fetch requests
    const prefetchList = uncachedPaths?.map((link) => createPrefetch(link));

    // Execute batch of requests
    const prefetchResponses = await Promise.all(prefetchList);

    // Cache responses in indexed db
    await setMany(prefetchResponses);
  } catch (error) {
    console.warn('[PRPL] Failed to prefetch in worker', error);
  }
};
