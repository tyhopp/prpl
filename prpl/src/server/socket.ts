// if ('WebSocket' in window) {
//   const protocol = window.location.protocol === 'http:' ? 'ws://' : 'wss://';
//   const address = `${protocol}${window.location.host}${window.location.pathname}/ws`;
//   const socket = new WebSocket(address);

//   socket.onmessage = ({ data: href }) => {
//     if (!href) {
//       return;
//     }

//     fetch(href)
//       .then((response) => {
//         // Handle HTML files
//         if (href === '/' || href.endsWith('.html')) {
//           return response.text().then((html) => {
//             const origin = window.location.origin;

//             // Refresh the html cache
//             sessionStorage.setItem(`prpl-${origin}${href}`, html);

//             // If the currently viewing page was updated, refresh it via the router
//             if (window.location.pathname === href) {
//               const pseudoAnchor = document.createElement('a');
//               pseudoAnchor.href = href;
//               document.querySelector('main').appendChild(pseudoAnchor);
//               pseudoAnchor.click();
//             }
//           });
//         }

//         // TODO - Dependency tree awareness for atomic replacement
//         // Handle CSS
//         if (href.endsWith('.css')) {
//           const styleElements = document.querySelectorAll('[rel="stylesheet"]');
//           styleElements.forEach((styleElement) => {
//             styleElement.parentNode.replaceChild(styleElement, styleElement);
//           });
//           return;
//         }

//         // Resolve relative path
//         let relativeHref = href;
//         const hrefPath = href.split('/');
//         const currentPath = window.location.pathname.split('/');
//         if (hrefPath && currentPath.length) {
//           currentPath.forEach((path, index) => {
//             if (!path.length) {
//               return;
//             }
//             if (path === hrefPath[index]) {
//               relativeHref = relativeHref.replace(`/${hrefPath[index]}`, '');
//             }
//           });
//         }
//         relativeHref =
//           relativeHref[0] === '/' ? relativeHref.slice(1) : relativeHref;

//         // TODO - Dependency tree awareness for atomic replacement
//         // Handle JS and other resources
//         const elements = document.querySelectorAll(
//           `[href*="${relativeHref}"], [src*="${relativeHref}"]`
//         );
//         elements.forEach((element) => {
//           if (element.tagName.toLowerCase() === 'script') {
//             const pseudoAnchor = document.createElement('a');
//             pseudoAnchor.href = window.location.href;
//             document.querySelector('main').appendChild(pseudoAnchor);
//             pseudoAnchor.click();
//             return;
//           }
//           element.parentNode.replaceChild(element, element);
//         });
//       })
//       .catch((error) =>
//         console.warn(`[PRPL] Failed to refresh resource ${href}`, error)
//       );
//   };
// }

// export {};

export {};
