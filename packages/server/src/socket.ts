if ('WebSocket' in window) {
  const { protocol: originalProtocol, host, pathname } = window?.location || {};
  const protocol = originalProtocol === 'http:' ? 'ws://' : 'wss://';
  const address = `${protocol}${host}${pathname}/ws`;
  const socket = new WebSocket(address);

  socket.onmessage = ({ data: href }: { data: string }): void => {
    if (!href) {
      return;
    }

    fetch(href)
      .then((response) => {
        // Handle HTML files
        if (href === '/' || href?.endsWith('.html')) {
          return response?.text()?.then((html) => {
            const { origin, pathname } = window.location || {};

            // Refresh the html cache
            sessionStorage?.setItem(`prpl-${origin}${href}`, html);

            // If the currently viewing page was updated, refresh it via the router
            if (pathname === href) {
              const pseudoAnchor = document?.createElement('a');
              pseudoAnchor.href = href;
              document.querySelector('main')?.appendChild(pseudoAnchor);
              pseudoAnchor?.click();
            }
          });
        }

        // Handle CSS
        if (href?.endsWith('.css')) {
          const styleElements = document.querySelectorAll('[rel="stylesheet"]');
          styleElements.forEach((styleElement) => {
            styleElement?.parentNode?.replaceChild(styleElement, styleElement);
          });
          return;
        }

        // For everything else, keep it simple and refresh the page
        window.location.reload();
      })
      .catch((error) => console.warn(`[PRPL] Failed to refresh resource '${href}'. Error:`, error));
  };
}
