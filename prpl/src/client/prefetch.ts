// Utility function to calculate unique relative paths
function getRelativePaths() {
  // TODO - Define more granular definition of which anchor tags the PRPL prefetch worker should to try to fetch
  const relativePaths = [
    ...Array.from(document.querySelectorAll('a:not([rel])'))
      .filter((link) => (link as HTMLAnchorElement)?.href?.includes(window?.location?.origin))
      .map((link) => (link as HTMLAnchorElement)?.href)
  ];
  return Array.from(new Set(relativePaths));
}

if (window.Worker) {
  // Instantiate prefetch worker
  const prefetchWorker = new Worker('prefetch-worker.js');

  // Initial prefetch
  prefetchWorker.postMessage(getRelativePaths());

  // Listen for responses
  prefetchWorker.onmessage = (event) => {
    const prefetchedPages = event.data;
    if (!prefetchedPages.length) {
      return;
    }
    for (let i = 0; i < prefetchedPages.length; i++) {
      sessionStorage.setItem(prefetchedPages[i].key, prefetchedPages[i].value);
    }
  };

  // Subsequent prefetch
  window.addEventListener('prpl-render', () => {
    try {
      prefetchWorker.postMessage(getRelativePaths());
    } catch (error) {
      console.error(
        '[PRPL] Failed to prefetch on subsequent page route',
        error
      );
    }
  });
} else {
  console.error(`[PRPL] Your browser doesn't support web workers`);
}
