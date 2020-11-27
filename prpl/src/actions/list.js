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

  // Isolate list item template
  const prplTag = /<prpl.*<\/prpl>/s.exec(template.src)[0];
  const liTemplateStart = /<prpl.*>/.exec(prplTag)[0].length;
  const liTemplateEnd = prplTag.length - 7;
  const liTemplate = prplTag.substring(liTemplateStart, liTemplateEnd);

  // Fill metadata in list item template
  const list = contentFiles.reduce((fullList, file) => {
    const srcPath = `${contentSrc}/${file}`;
    const { metadata } = parse(fs.readFileSync(srcPath).toString());

    let liTemplateInstance = String(liTemplate);
    for (const key in metadata) {
      if (liTemplateInstance.includes(`[${key}]`)) {
        liTemplateInstance = liTemplateInstance.replace(`[${key}]`, metadata[key]);
      }
    }

    return `${fullList}${liTemplateInstance}`;
  }, '');

  const templateWithList = template.src.replace(/<prpl.*<\/prpl>/s, list);
  fs.writeFileSync(targetPath, templateWithList);
}

module.exports = {
  list
}