const fs = require('fs');
const transform = require('marked');

/**
 * Transforms a markdown file to an HTML string.
 * @param {string} file A markdown file
 * @returns {string} An HTML string
 */
const markdown = file => {
  const markdown = fs.readFileSync(file).toString();
  const html = transform(markdown);
  return html;
}

module.exports = {
  markdown
}