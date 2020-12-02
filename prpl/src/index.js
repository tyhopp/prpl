const path = require('path');
const fs = require('fs');
const createTree = require('directory-tree');
const { ensure } = require(path.resolve(__dirname, 'actions/ensure'));
const { copy } = require(path.resolve(__dirname, 'actions/copy'));
const { interpolate } = require('./actions/interpolate');

// Refresh dist
const dist = path.resolve('dist');
if (fs.existsSync(dist)) {
  fs.rmdirSync(dist, { recursive: true });
}
ensure('dist');

// Provide prefetch and router scripts
['prefetch', 'router'].forEach(script => {
  fs.writeFileSync(`${dist}/${script}.js`, fs.readFileSync(path.resolve(__dirname, `${script}.js`)));
});

/**
 * Recursively operates on a list of items in a file system directory.
 * @param {Array} items A list of objects describing items in a file system
 */
const walk = items => items.forEach(item => {
  switch(item.type) {
    case 'file':
      if (item.extension === '.html') {
        interpolate(item);
        break;
      }
      copy(item);
      break;
    case 'directory':
      walk(item.children);
      break;
  }
});

// Create and walk the source tree
const tree = createTree(path.resolve('src'), { normalizePath: true }).children;
walk(tree);