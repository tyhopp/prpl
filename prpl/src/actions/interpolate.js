const path = require('path');
const fs = require('fs');
const { list } = require('./list');
const { inject } = require('./inject');

/**
 * Parses a template and interpolates target content.
 * @param {Object} item
 */
const interpolate = (item) => {
  const template = {
    ...item,
    src: fs.readFileSync(item.path).toString()
  };
  const depth = item.path.replace(`${path.resolve('src')}/`, '').split('/');
  depth.pop();
  const root = depth.reduce((acc) => acc + '../', '');

  // Add prefetch and router script tags
  template.src = template.src.replace(
    /<\/head>/,
    `<script defer src="${root}prefetch.js"></script>\n<script defer src="${root}router.js"></script>\n</head>`
  );
  if (!/<prpl/.test(template.src)) {
    fs.writeFileSync(item.path.replace('src', 'dist'), template.src);
    return;
  }

  // Extract <prpl> attributes
  const attrs = /<prpl (.*?)>/.exec(template.src)[1];
  if (!attrs) {
    console.error(
      '[Error] - A <prpl> tag requires at least a src attribute. Exiting.'
    );
    process.exit();
  }
  const keys = Array.from(
    ` ${attrs}`.matchAll(/\s(.*?)=/g),
    (match) => match[1]
  );
  const values = Array.from(
    ` ${attrs}`.matchAll(/"(.*?)"/g),
    (match) => match[1]
  );
  const attrObj = keys.reduce((prev, curr, index) => {
    prev[curr] = values[index];
    return prev;
  }, {});

  const contentType = attrObj['type'];
  const contentSrc = path.resolve(attrObj['src']);
  const contentFiles = fs.readdirSync(contentSrc);

  switch (contentType) {
    case 'list':
      list({ contentFiles, contentSrc, template });
      break;
    case 'inject':
      inject({ contentFiles, contentSrc, template });
      break;
    default:
      inject({ contentFiles, contentSrc, template });
  }
};

module.exports = {
  interpolate
};
