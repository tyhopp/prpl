import { PRPLClientStorageItem } from '../types/prpl.js';

/**
 * Web worker that receives a set of page paths to prefetch data for and returns the html string.
 *
 * Context variable notifies TS that the context is Worker, not Window.
 * @see {@link https://stackoverflow.com/questions/50402004/error-ts2554-expected-2-3-arguments-but-got-1/50420456#50420456}
 */
const context: Worker = self as any;

onmessage = (event: { data: string[] }) => {
  try {
    const uniqueRelativeLinks: string[] = event?.data;
    const prefetchedItems: Promise<PRPLClientStorageItem | void>[] = uniqueRelativeLinks?.map(
      (link) => {
        return fetch(link)
          .then((response) => response?.text())
          .then((html) => {
            return {
              storageKey: `prpl-${link}`,
              storageValue: html
            };
          })
          .catch((error) => {
            console.warn('[PRPL] Failed to prefetch page.', error);
          });
      }
    );
    Promise.all(prefetchedItems)
      .then((response) => {
        context?.postMessage(response);
      })
      .catch((error) => {
        console.warn('[PRPL] Failed to prefetch pages.', error);
      });
  } catch (error) {
    console.warn('[PRPL] Failed to prefetch in worker', error);
  }
};
