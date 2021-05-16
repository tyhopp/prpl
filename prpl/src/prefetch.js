// TODO - Do this in a worker
const prefetch = () => {
  const relativeLinks = [
    ...Array.from(document.querySelectorAll('a'))
      .filter(
        (link) =>
          link.href !== window.location.href &&
          link.href.includes(window.location.origin)
      )
      .map((link) => link.href)
  ];
  const uniqueRelativeLinks = Array.from(new Set(relativeLinks));

  const preloadLinkRequests = uniqueRelativeLinks.map((link) => {
    return fetch(link)
      .then((response) => response.text())
      .then((html) => {
        sessionStorage.setItem(`prpl-${link}`, html);

        const parser = new DOMParser();
        const htmlDOM = parser.parseFromString(html, 'text/html');
        const preloadResources = Array.from(
          htmlDOM.querySelectorAll('[rel=preload]')
        );
        const uniquePreloadResources = Array.from(new Set(preloadResources));
        const preloadResourceRequests = uniquePreloadResources.map((resource) =>
          fetch(resource.href)
        );
        Promise.all(preloadResourceRequests);
      })
      .catch((error) => console.error('Failed to prefetch page.', error));
  });
  Promise.all(preloadLinkRequests);
};

window.addEventListener('prpl-render', () => {
  prefetch();
});

prefetch();
