const fs = require('fs');
const { ensure } = require('./ensure');

/**
 * Copy a file to the dist directory.
 * @param {object} item 
 * @param {string} item.path
 * @param {string} item.name
 */
const copy = item => {
  const dir = item.path.replace(item.name, '').replace('src', 'dist');
  ensure(dir);
  const file = fs.readFileSync(item.path).toString();
  fs.writeFileSync(`${dir}/${item.name}`, file);
}

module.exports = {
  copy
}