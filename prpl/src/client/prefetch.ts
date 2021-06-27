import { PRPLClientStorageItem, PRPLClientEvent } from '../types/prpl.js';

/**
 * Utility function to calculate unique relative paths to prefetch in a worker.
 */
function getRelativePaths(): string[] {
  // TODO - Define more granular definition of which anchor tags the PRPL prefetch worker should to try to fetch
  const relativePaths: string[] = [
    ...Array.from(document?.querySelectorAll('a:not([rel])'))
      .filter((link) =>
        (link as HTMLAnchorElement)?.href?.includes(window?.location?.origin)
      )
      .map((link) => (link as HTMLAnchorElement)?.href)
  ];
  return Array.from(new Set(relativePaths));
}

if (window.Worker) {
  // Instantiate prefetch worker
  const prefetchWorker = new Worker('prefetch-worker.js');

  // Initial prefetch
  prefetchWorker?.postMessage(getRelativePaths());

  // Listen for responses
  prefetchWorker.onmessage = (event: { data: PRPLClientStorageItem[] }) => {
    const prefetchedPages = event?.data;
    for (let i = 0; i < prefetchedPages?.length; i++) {
      const { storageKey, storageValue } = prefetchedPages?.[i] || {};
      if (!storageKey || !storageValue) {
        return;
      }
      sessionStorage?.setItem(storageKey, storageValue);
    }
  };

  // Subsequent prefetch
  window.addEventListener(PRPLClientEvent.render, () => {
    try {
      prefetchWorker?.postMessage(getRelativePaths());
    } catch (error) {
      console.info(
        '[PRPL] Failed to prefetch on subsequent page route. Error:',
        error
      );
    }
  });
} else {
  console.info(`[PRPL] Your browser doesn't support web workers.`);
}
