/**
 * Web worker that receives a set of page paths to prefetch data for and returns the html string.
 */
onmessage = (event) => {
  try {
    const uniqueRelativeLinks = event.data;
    const preloadLinkRequests = uniqueRelativeLinks.map((link) => {
      return fetch(link)
        .then((response) => response.text())
        .then((html) => {
          return {
            key: `prpl-${link}`,
            value: html
          };
        })
        .catch((error) =>
          console.error('[PRPL] Failed to prefetch page.', error)
        );
    });
    Promise.all(preloadLinkRequests)
      .then((response) => {
        postMessage(response);
      })
      .catch((error) =>
        console.error('[PRPL] Failed to prefetch pages.', error)
      );
  } catch (error) {
    console.error('[PRPL] Failed to prefetch in worker', error);
  }
};
