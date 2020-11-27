const path = require('path');
const fs = require('fs');
const { ensure } = require('./ensure');
const { parse } = require('./parse');
const { markdown } = require('../transforms/markdown');

/**
 * Injects a child into an HTML string.
 * @param {string} src The HTML source
 * @param {*} content The HTML content block to inject
 * @returns {string} An HTML string
 */
const replace = (src, content) => {
  return src.replace(/<prpl.*<\/prpl>/, content);
}

/**
 * Injects content into a template, outputting a new file for each content item.
 * @param {Object} obj
 * @param {Array} obj.contentFiles The files to inject into the template
 * @param {string} obj.contentSrc The path to the directory containing the content files
 * @param {Object} obj.template The template details
 */
const inject = ({ contentFiles, contentSrc, template }) => {
  const targetDir = template.path.replace(template.name, '').replace('src', 'dist');
  ensure(targetDir);

  for (let i = 0; i < contentFiles.length; i++) {
    const srcPath = `${contentSrc}/${contentFiles[i]}`;
    const targetPath = `${targetDir}${path.parse(contentFiles[i]).name}.html`;

    switch(path.extname(contentFiles[i])) {
      case '.html':
        fs.writeFileSync(targetPath, replace(template.src, parse(fs.readFileSync(srcPath).toString()).html));
        break;
      case '.md':
      case '.markdown':
        fs.writeFileSync(targetPath, replace(template.src, parse(markdown(srcPath)).html));
        break;
      default:
        console.error(`[LOG] Skipping file with unsupported extension ${path.extname(srcPath)}. Supported file extensions include: .html, .md, .markdown`);
    }
  }
}

module.exports = {
  inject
}