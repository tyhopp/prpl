const path = require('path');
const fs = require('fs');
const { list } = require('./list');
const { page } = require('./page');
const { extract } = require('./extract');

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

  const prplAttrs = extract(template.src);

  const contentType = prplAttrs['type'];
  const contentSrc = path.resolve(prplAttrs['src']);
  const contentFiles = fs.readdirSync(contentSrc);

  switch (contentType) {
    case 'list':
      list({ contentFiles, contentSrc, template });
      break;
    case 'page':
      page({ contentFiles, contentSrc, template });
      break;
    default:
      page({ contentFiles, contentSrc, template });
  }
};

module.exports = {
  interpolate
};
