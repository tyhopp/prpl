// Utility function to calculate unique relative paths
function getRelativePaths() {
  const relativePaths = [
    ...Array.from(document.querySelectorAll('a'))
      .filter((link) => link.href.includes(window.location.origin))
      .map((link) => link.href)
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
      console.error('Failed to prefetch on subsequent page route', error);
    }
  });
} else {
  console.error(`Your browser doesn't support web workers`);
}
