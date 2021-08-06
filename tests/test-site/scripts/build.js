const { interpolate } = require('@prpl/core');
const { resolveHTMLImports } = require('@prpl/plugin-html-imports');

// Default options
const options = {
  noClientJS: false,
  templateRegex: (key) => new RegExp(`\\[${key}\\]`, 'g'),
  markedOptions: {}
};

async function build() {
  await interpolate({ options });
  await resolveHTMLImports();
}

build();
