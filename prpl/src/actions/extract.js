/**
 * Extract <prpl> tag attributes.
 * @param {string} page
 * @returns {Object}
 */
function extract(page) {
  const attrs = /<prpl(.*?)>/s.exec(page)[1].trim();

  if (!attrs) {
    console.error(
      '[Error] - A <prpl> tag requires at least a src attribute. Exiting.'
    );
    process.exit();
  }

  const attrObj = [...attrs.matchAll(/\s*((.*?)="(.*?)")/g)].reduce(
    (acc, curr) => {
      return {
        ...acc,
        [curr[2]]: curr[3]
      };
    },
    {}
  );

  return attrObj;
}

module.exports = {
  extract
};
