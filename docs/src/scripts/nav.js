const nav = document.querySelector('.nav');
const navToggle = document.querySelector('.nav-toggle');
const main = document.querySelector('.main');

navToggle.addEventListener('click', () => {
  nav.classList.toggle('nav-mobile-invisible');
});

nav.addEventListener('click', (event) => {
  if (event.target.closest('a[href]')) {
    nav.classList.toggle('nav-mobile-invisible');
  }
});

main.addEventListener('click', () => {
  if (!nav.classList.contains('nav-mobile-invisible')) {
    nav.classList.add('nav-mobile-invisible');
  }
});

const activeItem = document.querySelector(`[data-slug="${window.location.pathname}"]`);

if (activeItem) {
  activeItem.classList.add('nav-active');
}

window.addEventListener('prpl-render', () => {
  document
    .querySelectorAll('.nav-active')
    .forEach((element) => element.classList.remove('nav-active'));
  const newActiveNavItem = document.querySelector(`[data-slug="${window.location.pathname}"]`);
  if (newActiveNavItem) {
    newActiveNavItem.classList.add('nav-active');
  }
});
