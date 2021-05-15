const fs = require('fs');
const path = require('path');

/**
 * Ensures a directory exists.
 * @param {path} dir Path to a directory.
 */
const ensure = dir => {
  if (!fs.existsSync(path.resolve(dir))) {
    fs.mkdirSync(path.resolve(dir), { recursive: true });
  }
}

module.exports = {
  ensure
}