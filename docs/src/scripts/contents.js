function generateContents() {
  const contentsElement = document.querySelector('.side-menu-contents');

  while (contentsElement.firstChild) {
    contentsElement.removeChild(contentsElement.lastChild);
  }

  const contents = document.querySelectorAll('h2[id]');
  const fragment = document.createDocumentFragment();

  contents.forEach((content) => {
    const listItem = document.createElement('li');
    const item = document.createElement('a');
    const slug = `${window.location.pathname}#${content.getAttribute('id')}`;
    listItem.dataset.slug = slug;
    item.textContent = content.textContent;
    item.setAttribute('href', slug);
    listItem.appendChild(item);
    fragment.appendChild(listItem);
  });

  contentsElement.appendChild(fragment);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const id = entry.target.getAttribute('id');
      const slug = `${window.location.pathname}#${id}`;
      const method = entry.intersectionRatio > 0 ? 'add' : 'remove';
      const contentsItem = contentsElement.querySelector(`li[data-slug="${slug}"]`);
      if (contentsItem) {
        contentsItem.classList[method]('content-active');
      }
    });
  });

  contents.forEach((item) => observer.observe(item));
}

window.addEventListener('load', generateContents);
window.addEventListener('prpl-render', generateContents);
