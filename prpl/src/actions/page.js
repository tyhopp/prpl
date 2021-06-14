const path = require('path');
const fs = require('fs');
const { ensure } = require('./ensure');
const { parse } = require('./parse');
const { markdown } = require('../transforms/markdown');

/**
 * Renders pages of content items in multiple files.
 * @param {Object} obj
 * @param {Array} obj.contentFiles The files to inject into the template
 * @param {string} obj.contentSrc The path to the directory containing the content files
 * @param {Object} obj.template The template details
 */
const page = ({ contentFiles, contentSrc, template }) => {
  const targetDir = template.path
    .replace(template.name, '')
    .replace('src', 'dist');
  ensure(targetDir);

  pageLoop: for (let i = 0; i < contentFiles.length; i++) {
    let parsedContent;

    const { dir, base: name } = path.parse(contentFiles[i]);
    const relevantDir = dir.replace(path.resolve('.'), '');
    const relevantPath = `${relevantDir.replace('/src', '')}/${name}`;

    const srcPath = `${contentSrc}/${contentFiles[i]}`;
    const targetPath = `${targetDir}${path.parse(contentFiles[i]).name}.html`;

    switch (path.extname(contentFiles[i])) {
      case '.html':
        parsedContent = parse(
          fs.readFileSync(srcPath).toString(),
          relevantPath
        );
        break;
      case '.md':
      case '.markdown':
        parsedContent = parse(markdown(srcPath), relevantPath);
        break;
      default:
        if (fs.existsSync(srcPath) && !fs.lstatSync(srcPath).isDirectory()) {
          console.error(
            `Unsupported file ${relevantPath} - supported file types include: .html, .md, .markdown`
          );
        }
        continue pageLoop;
    }

    // Isolate src prpl template
    const prplTemplate = template.src.match(/(<prpl.*?>)(.*?)<\/prpl>/s)[2];

    // Fill src prpl template with content
    let prplTemplateInstance = String(prplTemplate);
    for (const key in parsedContent) {
      if (prplTemplateInstance.includes(`[${key}]`)) {
        const regex = new RegExp(`\\[${key}\\]`, 'g');
        prplTemplateInstance = prplTemplateInstance.replace(
          regex,
          parsedContent[key]
        );
      }
    }

    // Write page to dist
    const inerpolatedPage = template.src.replace(
      /<prpl.*<\/prpl>/s,
      prplTemplateInstance
    );
    fs.writeFileSync(targetPath, inerpolatedPage);
  }
};

module.exports = {
  page
};
