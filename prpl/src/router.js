/**
 * Helper function to extract a CSS attribute query.
 * @param {HTMLElement} tag
 * @returns {string}
 */
const extractQuery = (tag) => {
  const name = tag.tagName.toLowerCase();
  let attrQueries = '';
  for (let i = 0; i < tag.attributes.length; i++) {
    const { name: key, nodeValue: value } = tag.attributes[i];
    attrQueries = attrQueries.concat(`[${key}="${value}"]`);
  }
  return `${name}${attrQueries}`;
};

/**
 * Helper function to determine if the script should be ignored.
 * @param {HTMLElement} script
 * @returns {boolean}
 */
const ignoreScript = (script) => {
  if (script.tagName.toLowerCase() !== 'script') {
    return;
  }
  return (
    script.src.endsWith('/prefetch.js') ||
    script.src.endsWith('/router.js') ||
    script.getAttribute('dev') === ''
  );
};

window.addEventListener('popstate', () => {
  const url = window.location.href;

  try {
    const html = sessionStorage.getItem(`prpl-${url}`);
    const parser = new DOMParser();
    const target = parser.parseFromString(html, 'text/html');

    // Swap main
    const currentMain = document.querySelector('main');
    const targetMain = target.querySelector('main');
    currentMain.replaceWith(targetMain);

    // Resolve head
    const currentHeadTags = Array.from(document.querySelector('head').children);
    const targetHeadTags = Array.from(target.querySelector('head').children);

    // Remove head tags
    currentHeadTags.forEach((currentHeadTag) => {
      if (
        targetHeadTags.some((targetHeadTag) =>
          targetHeadTag.isEqualNode(currentHeadTag)
        )
      ) {
        return;
      }
      document.head.querySelector(extractQuery(currentHeadTag)).remove();
    });

    // Add head tags
    targetHeadTags.forEach((targetHeadTag) => {
      if (
        currentHeadTags.some((currentHeadTag) =>
          currentHeadTag.isEqualNode(targetHeadTag)
        ) ||
        ignoreScript(targetHeadTag)
      ) {
        return;
      }
      if (targetHeadTag.tagName.toLowerCase() === 'script') {
        const clonedScript = document.createElement('script');
        clonedScript.src = targetHeadTag.src;
        document.head.appendChild(clonedScript);
        return;
      }
      document.head.appendChild(targetHeadTag);
    });

    // Indicate render has finished
    dispatchEvent(new CustomEvent('prpl-render', { bubbles: true }));
  } catch (error) {
    window.location.assign(url);
    console.error('Failed render, falling back to full page reload.', error);
  }
});

document.addEventListener('click', (e) => {
  const anchor = e.target.closest('a');
  if (anchor && anchor.target !== '_blank') {
    e.preventDefault();

    const url = anchor.href;
    const state = anchor.state ? { url, ...JSON.parse(anchor.state) } : { url };

    try {
      history.pushState(state, null, url);
      dispatchEvent(new PopStateEvent('popstate', { state }));
    } catch (e) {
      window.location.assign(url);
    }
  }
});
