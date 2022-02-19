import { get } from 'idb-keyval';
import { PRPLClientEvent, PRPLClientScript, PRPLClientPerformanceMark } from '../types/prpl.js';

function extractAttributeQuery(tag: HTMLElement): string {
  const name = tag?.tagName?.toLowerCase();
  let attrQueries = '';
  for (let i = 0; i < tag?.attributes?.length; i++) {
    const { name: key, nodeValue: value } = tag?.attributes?.[i] || {};
    attrQueries = attrQueries?.concat(`[${key}="${value}"]`);
  }
  return `${name}${attrQueries}`;
}

function isPRPLScript(script: HTMLHeadElement): boolean {
  if (script?.tagName?.toLowerCase() !== 'script') {
    return;
  }
  return (
    (script as HTMLScriptElement)?.src?.endsWith(`/${PRPLClientScript.prefetch}.js`) ||
    (script as HTMLScriptElement)?.src?.endsWith(`/${PRPLClientScript.router}.js`) ||
    script?.getAttribute('dev') === ''
  );
}

function constructTargetDocument(html: string): Document {
  const parser = new DOMParser();
  const target = parser?.parseFromString(html, 'text/html');
  return target;
}

function diffDOM(target: Document): void {
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
      isPRPLScript(currentHeadTag)
    ) {
      return;
    }
    document?.head?.querySelector(extractAttributeQuery(currentHeadTag))?.remove();
  });

  // Add head tags
  targetHeadTags?.forEach((targetHeadTag) => {
    if (
      currentHeadTags?.some((currentHeadTag) => currentHeadTag?.isEqualNode(targetHeadTag)) ||
      isPRPLScript(targetHeadTag)
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
}

function adjustScroll(targetUrl: string, url: string, hash: string): void {
  // Scroll to hash if one exists in the url
  if (hash) {
    document.getElementById(hash)?.scrollIntoView();
  }

  // Scroll to top if user clicked a link, otherwise preserve scroll state
  if (!hash && url === targetUrl) {
    window?.scrollTo({ top: 0 });
  }
}

async function onPopState(event: PopStateEvent): Promise<void> {
  const [url, hash] = window?.location?.href?.split('#') || [];

  try {
    const [targetUrl] = event?.state?.url?.split('#') || [];
    const html = await get(`prpl-${url}`);
    if (!html) {
      throw new Error(`No cached html for route ${url}`);
    }
    const target = constructTargetDocument(html);
    diffDOM(target);
    adjustScroll(targetUrl, url, hash);
    dispatchEvent(new CustomEvent(PRPLClientEvent.render, { bubbles: true }));
    performance.mark(PRPLClientPerformanceMark.renderEnd);
  } catch (error) {
    window?.location?.assign(url);
    console.info('[PRPL] Routing natively. Reason:', error?.message);
  }
}

function onClick(event: MouseEvent): void {
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
}

document?.addEventListener('click', onClick);
window?.addEventListener('popstate', onPopState);
