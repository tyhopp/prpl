import { PRPLClientEvent, PRPLClientScript, PRPLClientPerformanceMark } from '../types/prpl.js';

/**
 * Helper function to extract a CSS attribute query.
 */
function extractQuery(tag: HTMLElement): string {
  const name = tag?.tagName?.toLowerCase();
  let attrQueries = '';
  for (let i = 0; i < tag?.attributes?.length; i++) {
    const { name: key, nodeValue: value } = tag?.attributes?.[i] || {};
    attrQueries = attrQueries?.concat(`[${key}="${value}"]`);
  }
  return `${name}${attrQueries}`;
}

/**
 * Helper function to determine if the script should be ignored during diff.
 */
function ignoreScript(script: HTMLHeadElement): boolean {
  if (script?.tagName?.toLowerCase() !== 'script') {
    return;
  }
  return (
    (script as HTMLScriptElement)?.src?.endsWith(`/${PRPLClientScript.prefetch}.js`) ||
    (script as HTMLScriptElement)?.src?.endsWith(`/${PRPLClientScript.router}.js`) ||
    script?.getAttribute('dev') === ''
  );
}

window?.addEventListener('popstate', (event: PopStateEvent) => {
  const url = window?.location?.href;

  try {
    const html = sessionStorage?.getItem(`prpl-${url}`);

    if (!html) {
      window?.location?.assign(url);
      console.info('[PRPL] Routing natively. Reason:', `No cached html for route ${url}`);
    }

    const parser = new DOMParser();
    const target = parser?.parseFromString(html, 'text/html');

    // Swap main
    const currentMain = document?.querySelector('main');
    const targetMain = target?.querySelector('main');
    currentMain?.replaceWith(targetMain);

    // Diff head
    const currentHeadTags = Array.from(
      document?.querySelector('head')?.children
    ) as HTMLHeadElement[];
    const targetHeadTags = Array.from(target?.querySelector('head')?.children) as HTMLHeadElement[];

    // Remove head tags
    currentHeadTags?.forEach((currentHeadTag) => {
      if (
        targetHeadTags?.some((targetHeadTag) => targetHeadTag?.isEqualNode(currentHeadTag)) ||
        ignoreScript(currentHeadTag)
      ) {
        return;
      }
      document?.head?.querySelector(extractQuery(currentHeadTag))?.remove();
    });

    // Add head tags
    targetHeadTags?.forEach((targetHeadTag) => {
      if (
        currentHeadTags?.some((currentHeadTag) => currentHeadTag?.isEqualNode(targetHeadTag)) ||
        ignoreScript(targetHeadTag)
      ) {
        return;
      }
      if (targetHeadTag?.tagName?.toLowerCase() === 'script') {
        const clonedScript = document?.createElement('script');
        clonedScript.src = (targetHeadTag as HTMLScriptElement)?.src;
        document?.head?.appendChild(clonedScript);
        return;
      }
      document?.head?.appendChild(targetHeadTag);
    });

    // Scroll to top if user clicked a link, otherwise preserve scroll state
    if (event?.state?.url === url) {
      window?.scrollTo({ top: 0 });
    }

    // Indicate render has finished
    dispatchEvent(new CustomEvent(PRPLClientEvent.render, { bubbles: true }));
    performance.mark(PRPLClientPerformanceMark.renderEnd);
  } catch (error) {
    window?.location?.assign(url);
    console.info('[PRPL] Routing natively. Reason:', error?.message);
  }
});

document?.addEventListener('click', (event: MouseEvent) => {
  performance.mark(PRPLClientPerformanceMark.renderStart);

  // TODO - Define more granular definition of which anchor tags the PRPL router should try to act on
  const anchor = (event?.target as HTMLElement)?.closest('a:not([rel])') as HTMLAnchorElement;

  if (anchor && anchor?.target !== '_blank') {
    event?.preventDefault();

    const url = anchor?.href;
    const state = { url };

    try {
      history?.pushState(state, null, url);
      dispatchEvent(new PopStateEvent('popstate', { state }));
    } catch (error) {
      window?.location?.assign(url);
    }
  }
});
