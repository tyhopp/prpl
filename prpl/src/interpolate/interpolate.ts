import { resolve, relative, parse } from 'path';
import { copyFile } from 'fs/promises';
import createTree, { DirectoryTree } from 'directory-tree';
import { log } from '../utils/log.js';
import { cwd } from '../utils/cwd.js';
import { PRPLClientScript } from '../types/prpl.js';
import { ensureDir } from '../utils/ensure-dir.js';

async function interpolate() {
  const PRPLClientScripts: PRPLClientScript[] = [
    PRPLClientScript.prefetch,
    PRPLClientScript.prefetchWorker,
    PRPLClientScript.router
  ];

  // Add PRPL client scripts to dist
  for (let s = 0; s < PRPLClientScripts.length; s++) {
    try {
      await copyFile(
        resolve(await cwd(import.meta), `../client/${PRPLClientScripts[s]}.js`),
        resolve(`dist/${PRPLClientScripts[s]}.js`)
      );
    } catch (error) {
      log.error(
        `Failed to copy ${PRPLClientScripts[s]}.js to dist. Error:`,
        error?.message
      );
    }
  }

  // Recursively walk the source tree
  async function walk(items: DirectoryTree[]) {
    for (let i = 0; i < items.length; i++) {
      const { type, extension, path, children } = items?.[i] || {};
      switch (type) {
        case 'file':
          if (extension === '.html') {
            try {
              const { dir } = parse(path?.replace('src', 'dist'));
              await ensureDir(dir);
              await copyFile(path, path?.replace('src', 'dist'));
              break;
            } catch (error) {
              log.error(
                `Failed to copy ${relative(resolve(), path)} to dist. Error:`,
                error?.message
              );
            }
          }
          break;
        case 'directory':
          walk(children);
          break;
      }
    }
  }

  // Create source tree
  const tree: DirectoryTree[] =
    createTree(resolve('src'), { normalizePath: true })?.children || [];

  await walk(tree);

  log.info('Build complete');
}

export { interpolate };
