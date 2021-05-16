const fs = require('fs');
const { ensure } = require('./ensure');
const { parse } = require('./parse');

/**
 * Renders a list of content items in a single file.
 * @param {Object} obj
 * @param {Array} obj.contentFiles The files to inject into the template
 * @param {string} obj.contentSrc The path to the directory containing the content files
 * @param {Object} obj.template The template details
 */
const list = ({ contentFiles, contentSrc, template }) => {
  const targetPath = template.path.replace('src', 'dist');
  const targetDir = targetPath.replace(template.name, '');
  ensure(targetDir);

  // Isolate src prpl template
  const prplTag = /<prpl.*<\/prpl>/s.exec(template.src)[0];
  const prplTemplateStart = /<prpl.*>/.exec(prplTag)[0].length;
  const prplTemplateEnd = prplTag.length - 7;
  const prplTemplate = prplTag.substring(prplTemplateStart, prplTemplateEnd);

  // Fill metadata in list item template
  const list = contentFiles.reduce((fullList, file) => {
    const srcPath = `${contentSrc}/${file}`;
    const parsedContent = parse(fs.readFileSync(srcPath).toString());

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

    return `${fullList}${prplTemplateInstance}`;
  }, '');

  const templateWithList = template.src.replace(/<prpl.*<\/prpl>/s, list);
  fs.writeFileSync(targetPath, templateWithList);
};

module.exports = {
  list
};
