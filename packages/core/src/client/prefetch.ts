import { PRPLClientEvent } from '../types/prpl.js';

/**
 * Collect unique relative anchor hrefs on the current page.
 */
function getRelativePaths(): string[] {
  // TODO - Define more granular definition of which anchor tags the PRPL prefetch worker should to try to fetch
  const relativePaths: string[] = [
    ...Array.from(document?.querySelectorAll('a:not([rel])'))
      .filter((link) => (link as HTMLAnchorElement)?.href?.includes(window?.location?.origin))
      .map((link) => (link as HTMLAnchorElement)?.href)
  ];
  return Array.from(new Set(relativePaths));
}

if (window.Worker) {
  // Instantiate prefetch worker
  const prefetchWorker = new Worker('prefetch-worker.js', { type: 'module' });

  // Initial optional prefetch of on page links
  prefetchWorker?.postMessage([window?.location?.href, ...getRelativePaths()]);

  // Subsequent prefetches on page render
  window.addEventListener(PRPLClientEvent.render, () => {
    try {
      prefetchWorker?.postMessage([window?.location?.href, ...getRelativePaths()]);
    } catch (error) {
      console.info('[PRPL] Failed to prefetch on subsequent page route. Error:', error);
    }
  });
} else {
  console.info(`[PRPL] Your browser doesn't support web workers.`);
}
