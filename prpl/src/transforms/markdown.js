const fs = require('fs');
const marked = require('marked');

// Override code block rendering
const renderer = {
  code(code, infostring) {
    return `<pre class="language-${infostring}"><code class="language-${infostring}">${code}</code></pre>`;
  }
};

marked.use({ renderer });

/**
 * Transforms a markdown file to an HTML string.
 * @param {string} file A markdown file
 * @returns {string} An HTML string
 */
const markdown = (file) => {
  const markdown = fs.readFileSync(file).toString();
  const html = marked(markdown);
  return html;
};

module.exports = {
  markdown
};
