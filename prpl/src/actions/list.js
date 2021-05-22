const fs = require('fs');
const { ensure } = require('./ensure');
const { parse } = require('./parse');
const { extract } = require('./extract');

/**
 * Renders a list of content items in a single file.
 * @param {Object} obj
 * @param {Array} obj.contentFiles The files to inject into the template
 * @param {string} obj.contentSrc The path to the directory containing the content files
 * @param {Object} obj.template The template details
 */
const list = ({ contentFiles, contentSrc, template }) => {
  let files = contentFiles;

  const targetPath = template.path.replace('src', 'dist');
  const targetDir = targetPath.replace(template.name, '');
  ensure(targetDir);

  // Isolate src prpl template
  const prplTemplate = template.src.match(/(<prpl.*?>)(.*?)<\/prpl>/s)[2];

  // Fill metadata in list item template
  let list = files.map((file) => {
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

    return {
      parsedContent,
      output: prplTemplateInstance
    };
  });

  // Extract prpl attrs
  const prplAttrs = extract(template.src);

  if ('order-by' in prplAttrs) {
    const sort = prplAttrs['order-by'];
    let direction = 'asc';

    if ('direction' in prplAttrs) {
      direction = prplAttrs['direction'];
    }

    try {
      list = list.sort((first, second) => {
        let firstComparator = first.parsedContent[sort];
        let secondComparator = second.parsedContent[sort];

        if (sort.toLowerCase() === 'date' || sort.toLowerCase() === 'time') {
          firstComparator = new Date(firstComparator).getTime();
          secondComparator = new Date(secondComparator).getTime();

          return direction === 'asc'
            ? firstComparator - secondComparator
            : secondComparator - firstComparator;
        }

        if (firstComparator === secondComparator) {
          return 0;
        }

        return direction === 'asc'
          ? firstComparator > secondComparator
            ? 1
            : -1
          : secondComparator < firstComparator
          ? -1
          : 1;
      });
    } catch (error) {
      console.error(`[Error] Failed to sort by ${sort}`);
    }
  }

  if ('limit' in prplAttrs) {
    const limit = prplAttrs['limit'];
    try {
      list = list.slice(0, limit);
    } catch (error) {
      console.error(`[Error] Failed to limit to ${limit}`);
    }
  }

  list = list.map((item) => item.output).join('');

  const templateWithList = template.src.replace(/<prpl.*<\/prpl>/s, list);
  fs.writeFileSync(targetPath, templateWithList);
};

module.exports = {
  list
};
