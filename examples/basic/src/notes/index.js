{
  // Scripts must not be global
  const main = document.querySelector('main');

  const note = document.createElement('h3');
  note.textContent = 'Note - This DOM node was added at runtime!';

  main.appendChild(note);
}
