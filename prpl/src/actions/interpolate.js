const path = require('path');
const fs = require('fs');
const { copy } = require('./copy');
const { inject } = require('./inject');

/**
 * Parses a template and interpolates target content.
 * @param {Object} item
 */
const interpolate = item => {
  const template = {
    ...item,
    src: fs.readFileSync(item.path).toString()
  };

  if (!/<prpl/.test(template.src)) {
    copy(template);
    return;
  }

  // Extract <prpl> attributes
  const attrs = /<prpl (.*?)>/.exec(template.src)[1];
  if (!attrs) {
    console.error('[Error] - A <prpl> tag requires at least a src attribute. Exiting.');
    process.exit();
  }
  const keys = Array.from(` ${attrs}`.matchAll(/\s(.*?)=/g), match => match[1]);
  const values = Array.from(` ${attrs}`.matchAll(/"(.*?)"/g), match => match[1]);
  const attrObj = keys.reduce((prev, curr, index) => {
    prev[curr] = values[index];
    return prev;
  }, {});

  const contentType = attrObj['type'];
  const contentSrc = path.resolve(attrObj['src']);
  const contentFiles = fs.readdirSync(contentSrc);

  switch(contentType) {
    case 'list':
      break;
    case 'inject':
      inject({ contentFiles, contentSrc, template });
      break;
    default:
  }
}

module.exports = {
  interpolate
}