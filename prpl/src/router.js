window.addEventListener('popstate', () => {
  const url = window.location.href;
  try {
    const html = sessionStorage.getItem(`prpl-${url}`);
    const parser = new DOMParser();
    const currentMain = document.querySelector('main');
    const targetMain = parser.parseFromString(html, 'text/html').querySelector('main');
    currentMain.replaceWith(targetMain);
    dispatchEvent(new CustomEvent('prpl-render', { bubbles: true }));
  } catch (error) {
    window.location.assign(url);
    console.error('Failed to get html from session storage.' , error);
  }
});

document.addEventListener('click', e => {
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