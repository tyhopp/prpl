const path = require('path');
const fs = require('fs');
const { copy } = require('./copy');
const { markdown } = require('../transforms/markdown');
const { inject } = require('./inject');
const { ensure } = require('./ensure');

/**
 * Attempts to interpolate two HTML strings.
 * @param {Object} item
 */
const interpolate = item => {
  const src = fs.readFileSync(item.path).toString();

  if (!/<prpl/.test(src)) {
    copy(item);
    return;
  }

  const attrs = /<prpl (.*?)>/.exec(src)[1];
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

  const contentSrc = path.resolve(attrObj['src']);
  const contentFiles = fs.readdirSync(contentSrc);

  for (let i = 0; i < contentFiles.length; i++) {
    const dir = item.path.replace(item.name, '').replace('src', 'dist');
    const srcPath = `${contentSrc}/${contentFiles[i]}`;
    const targetPath = `${dir}${path.parse(contentFiles[i]).name}.html`;
    ensure(dir);
    
    switch(path.extname(contentFiles[i])) {
      case '.html':
        fs.writeFileSync(targetPath, inject(src, fs.readFileSync(srcPath).toString()));
        break;
      case '.md':
      case '.markdown':
        fs.writeFileSync(targetPath, inject(src, markdown(srcPath)));
        break;
      default:
        console.error(`[LOG] Skipping file with unsupported extension ${path.extname(srcPath)}. Supported file extensions include: .html, .md, .markdown`);
    }
  }

}

module.exports = {
  interpolate
}