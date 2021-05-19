/**
 * Extract <prpl> tag attributes.
 * @param {string} page
 * @returns {Object}
 */
function extract(page) {
  const attrs = /<prpl (.*?)>/.exec(page)[1];

  if (!attrs) {
    console.error(
      '[Error] - A <prpl> tag requires at least a src attribute. Exiting.'
    );
    process.exit();
  }

  const keys = Array.from(
    ` ${attrs}`.matchAll(/\s(.*?)=/g),
    (match) => match[1]
  );

  const values = Array.from(
    ` ${attrs}`.matchAll(/"(.*?)"/g),
    (match) => match[1]
  );

  const attrObj = keys.reduce((prev, curr, index) => {
    prev[curr] = values[index];
    return prev;
  }, {});

  return attrObj;
}

module.exports = {
  extract
};
