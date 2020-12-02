// TODO - Do this in a worker
const prefetch = () => {
  const links = [
    window.location.href,
    ...Array.from(document.querySelectorAll('a'))
      .filter(link => link.href.includes(window.location.origin))
      .map(link => link.href)
  ]
    .map(link => {
      return fetch(link)
        .then(response => response.text())
        .then(html => sessionStorage.setItem(`prpl-${link}`, html))
        .catch(error => console.error('Failed to prefetch page.' , error));
    });
  Promise.all(links);
}

window.addEventListener('prpl-render', () => {
  prefetch();
});

prefetch();