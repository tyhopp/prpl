import { PRPLClientEvent } from '../types/prpl.js';

// TODO - Define more granular definition of which anchor tags the PRPL prefetch worker should to try to fetch
function getPaths(): string[] {
  const relativePaths: string[] = [
    ...Array.from(document?.querySelectorAll('a:not([rel])'))
      .filter((link) => (link as HTMLAnchorElement)?.href?.includes(window?.location?.origin))
      .map((link) => (link as HTMLAnchorElement)?.href)
  ];
  return [window?.location?.href, ...Array.from(new Set(relativePaths))];
}

function getPRPLBuildId(): string {
  return document.querySelector('meta[name="prpl-build-id"]')?.getAttribute('content');
}

if (window.Worker) {
  // Instantiate prefetch worker
  const prefetchWorker = new Worker('prefetch-worker.js', { type: 'module' });

  // Initial optional prefetch of on page links
  prefetchWorker?.postMessage({
    paths: getPaths(),
    buildId: getPRPLBuildId()
  });

  // Subsequent prefetches on page render
  window.addEventListener(PRPLClientEvent.render, () => {
    try {
      prefetchWorker?.postMessage({
        paths: getPaths(),
        buildId: getPRPLBuildId()
      });
    } catch (error) {
      console.info('[PRPL] Failed to prefetch on subsequent page route. Error:', error);
    }
  });
} else {
  console.info(`[PRPL] Your browser doesn't support web workers.`);
}
