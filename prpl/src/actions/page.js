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

  for (let i = 0; i < contentFiles.length; i++) {
    let parsedContent;

    const srcPath = `${contentSrc}/${contentFiles[i]}`;
    const targetPath = `${targetDir}${path.parse(contentFiles[i]).name}.html`;

    switch (path.extname(contentFiles[i])) {
      case '.html':
        parsedContent = parse(fs.readFileSync(srcPath).toString());
        break;
      case '.md':
      case '.markdown':
        parsedContent = parse(markdown(srcPath));
        break;
      default:
        console.error(
          `[LOG] Skipping file with unsupported extension ${path.extname(
            srcPath
          )}. Supported file extensions include: .html, .md, .markdown`
        );
    }

    // Isolate src prpl template
    const prplTag = /<prpl.*<\/prpl>/s.exec(template.src)[0];
    const prplTemplateStart = /<prpl.*>/.exec(prplTag)[0].length;
    const prplTemplateEnd = prplTag.length - 7;
    const prplTemplate = prplTag.substring(prplTemplateStart, prplTemplateEnd);

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
