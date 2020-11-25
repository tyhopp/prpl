/**
 * Injects a child into an HTML string.
 * @param {string} src The HTML source
 * @param {*} content The HTML content block to inject
 * @returns {string} An HTML string
 */
const inject = (src, content) => {
  return src.replace(/<prpl.*<\/prpl>/, content);
}

module.exports = {
  inject
}