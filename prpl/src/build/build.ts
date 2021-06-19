#!/usr/bin/env node

import { resolve } from 'path';
import { existsSync, rmdirSync, readFileSync, writeFileSync } from 'fs';
import createTree from 'directory-tree';
import { ensureDirExists } from './actions/ensure-dir-exists';
import { copyFileToDist } from './actions/copy-file-to-dist';
import { interpolate } from './actions/interpolate';

// Colorize console messages
const builtInLog = console.log;
const builtInError = console.error;
console.log = function () {
  builtInLog('\x1b[35m', '[PRPL]', ...arguments, '\x1b[0m');
};
console.error = function () {
  builtInError('\x1b[35m', '[PRPL]', ...arguments, '\x1b[0m');
};

// Refresh dist
const dist = resolve('dist');
if (existsSync(dist)) {
  rmdirSync(dist, { recursive: true });
}
ensureDirExists('dist');

// Provide prefetch and router scripts
['prefetch', 'prefetch-worker', 'router'].forEach((script) => {
  writeFileSync(
    `${dist}/${script}.js`,
    readFileSync(resolve(import.meta.url, `${script}.js`))
  );
});

/**
 * Recursively operates on a list of items in a file system directory.
 * @param {Array} items A list of objects describing items in a file system
 */
const walk = (items) =>
  items.forEach((item) => {
    switch (item.type) {
      case 'file':
        if (item.extension === '.html') {
          interpolate(item);
          break;
        }
        copyFileToDist(item);
        break;
      case 'directory':
        walk(item.children);
        break;
    }
  });

// Create and walk the source tree
const tree = createTree(resolve('src'), { normalizePath: true }).children;
walk(tree);

console.log('Build complete');

export {}