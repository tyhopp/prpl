const path = require('path');
const fs = require('fs');
const { list } = require('./list');
const { page } = require('./page');
const { extract } = require('./extract');
const { ensure } = require('./ensure');
const { PRPL_TYPE_VALUES } = require('../utils/constants');

/**
 * Parses a template and interpolates target content.
 * @param {Object} item
 */
const interpolate = (item) => {
  const template = {
    ...item,
    src: fs.readFileSync(item.path).toString()
  };
  const depth = item.path.replace(`${path.resolve('src')}/`, '').split('/');
  depth.pop();
  const root = depth.reduce((acc) => acc + '../', '');

  // Add prefetch and router script tags
  template.src = template.src.replace(
    /<\/head>/,
    `<script defer src="${root}prefetch.js"></script>\n<script defer src="${root}router.js"></script>\n</head>`
  );

  const targetPath = item.path.replace('src', 'dist');
  const targetDir = targetPath.replace(item.name, '');

  const { dir, base: name } = path.parse(item.path);
  const relevantDir = dir.replace(path.resolve('.'), '');
  const relevantPath = `${relevantDir.replace('/src', '')}/${name}`;

  if (!/<prpl/.test(template.src)) {
    ensure(targetDir);
    fs.writeFileSync(targetPath, template.src);
    return;
  }

  const { prplAttrs, prplAttrsRaw } = extract(template.src);

  if (!Object.keys(prplAttrs).length) {
    console.error(
      `<prpl> tag in ${relevantPath} requires a src and type attribute`
    );
    ensure(targetDir);
    fs.writeFileSync(targetPath, template.src);
    return;
  }

  if (Object.keys(prplAttrs).length && !('src' in prplAttrs)) {
    console.log(
      `No src attribute found in <prpl ${prplAttrsRaw}> in ${relevantPath}`
    );
    ensure(targetDir);
    fs.writeFileSync(targetPath, template.src);
    return;
  }

  if (Object.keys(prplAttrs).length && !('type' in prplAttrs)) {
    console.log(
      `No type attribute found in <prpl ${prplAttrsRaw}> in ${relevantPath}`
    );
    ensure(targetDir);
    fs.writeFileSync(targetPath, template.src);
    return;
  }

  if (
    Object.keys(prplAttrs).length &&
    !PRPL_TYPE_VALUES.includes(prplAttrs['type'])
  ) {
    console.log(
      `No valid type attribute found in <prpl ${prplAttrsRaw}> in ${relevantPath}. Valid type values are: ${PRPL_TYPE_VALUES.join(
        ', '
      )}`
    );
    ensure(targetDir);
    fs.writeFileSync(targetPath, template.src);
    return;
  }

  const contentType = prplAttrs['type'];
  const contentSrc = path.resolve(prplAttrs['src']);

  if (
    !fs.existsSync(contentSrc) ||
    !fs
      .readdirSync(contentSrc, { withFileTypes: true })
      .filter((item) => !item.isDirectory()).length
  ) {
    console.log(
      `No content files found in <prpl ${prplAttrsRaw}> in ${relevantPath}`
    );
    ensure(targetDir);
    fs.writeFileSync(targetPath, template.src);
    return;
  }

  const contentFiles = fs.readdirSync(contentSrc);

  switch (contentType) {
    case 'list':
      list({ contentFiles, contentSrc, template });
      break;
    case 'page':
      page({ contentFiles, contentSrc, template });
      break;
    default:
      page({ contentFiles, contentSrc, template });
  }
};

module.exports = {
  interpolate
};
