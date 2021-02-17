if ('WebSocket' in window) {
  const protocol = window.location.protocol === 'http:' ? 'ws://' : 'wss://';
  const address = `${protocol}${window.location.host}${window.location.pathname}/ws`;
  const socket = new WebSocket(address);

  socket.onmessage = ({ data: href }) => {
    if (!href) {
      return;
    }

    fetch(href)
      .then((response) => {
        if (href === '/' || href.includes('html')) {
          return response.text().then((html) => {
            const origin = window.location.origin;

            // Refresh the html cache
            sessionStorage.setItem(`prpl-${origin}${href}`, html);

            // If the currently viewing page was updated, refresh it via the router
            if (window.location.pathname === href) {
              const pseudoAnchor = document.createElement('a');
              pseudoAnchor.href = href;
              document.querySelector('main').appendChild(pseudoAnchor);
              pseudoAnchor.click();
            }
          });
        }
        
        const elements = document.querySelectorAll(`[href="${href.slice(1)}"]`);
        if (!elements.length) {
          return;
        }
        elements.forEach((element) => {
          element.parentNode.replaceChild(element, element);
        });
      })
      .catch((error) =>
        console.warn(`[Server] Failed to refresh resource ${href}`, error)
      );
  };
}
