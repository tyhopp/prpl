/**
 * Extract <prpl> tag attributes.
 * @param {string} page
 * @returns {Object}
 */
function extract(page) {
  const prplAttrsRaw = /<prpl(.*?)>/s.exec(page)[1].trim();

  if (!prplAttrsRaw) {
    return {
      prplAttrs: {},
      prplAttrsRaw
    };
  }

  const prplAttrs = [...prplAttrsRaw.matchAll(/\s*((.*?)="(.*?)")/g)].reduce(
    (acc, curr) => {
      return {
        ...acc,
        [curr[2]]: curr[3]
      };
    },
    {}
  );

  return {
    prplAttrs,
    prplAttrsRaw
  };
}

module.exports = {
  extract
};
