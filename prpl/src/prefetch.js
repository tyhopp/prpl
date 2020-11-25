// TODO - Do this in a worker
const prefetch = () => {
  const links = [
    window.location.href,
    ...Array.from(document.querySelectorAll('a')).map(link => link.href)
  ]
    .map(link => {
      return fetch(link)
        .then(response => response.text())
        .then(html => localStorage.setItem(link, html))
        .catch(error => console.error('Failed to prefetch page.' , error));
    });
  Promise.all(links);
}

window.addEventListener('prpl-render', () => {
  prefetch();
});

prefetch();