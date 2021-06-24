import { resolve, relative, parse } from 'path';
import { copyFile, readFile } from 'fs/promises';
import {
  generateFileSystemTree,
  FileSystemTree
} from '../lib/generate-fs-tree.js';
import { log } from '../lib/log.js';
import { cwd } from '../lib/cwd.js';
import { PRPLClientScript } from '../types/prpl.js';
import { ensureDir } from '../lib/ensure-dir.js';
import { interpolateHTML } from './interpolate-html.js';

const PRPLClientScripts: PRPLClientScript[] = [
  PRPLClientScript.prefetch,
  PRPLClientScript.prefetchWorker,
  PRPLClientScript.router
];

async function interpolate(): Promise<void> {
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

  // Recursively walk the source tree depth first
  async function walkSourceTree(items: FileSystemTree['children']) {
    for (let i = 0; i < items.length; i++) {
      const { type, extension, path, children } = items?.[i] || {};
      const targetFilePath = path?.replace('src', 'dist');
      const targetDir = parse(targetFilePath)?.dir;

      switch (type) {
        case 'file':
          await ensureDir(targetDir);

          if (extension === '.html') {
            const { dir, base: name } = parse(path);

            const srcFileBuffer = await readFile(items?.[i]?.path);
            const src = srcFileBuffer?.toString();
            const srcRelativeDir = dir?.replace(resolve('.'), '');
            const srcRelativeFilePath = `${srcRelativeDir?.replace(
              '/src',
              ''
            )}/${name}`;

            await interpolateHTML({
              ...items?.[i],
              src,
              srcRelativeDir,
              srcRelativeFilePath,
              targetDir,
              targetFilePath
            });
            break;
          }

          try {
            await copyFile(path, targetFilePath);
          } catch (error) {
            log.error(
              `Failed to copy ${relative(resolve(), path)} to dist. Error:`,
              error?.message
            );
          }
          break;
        case 'directory':
          walkSourceTree(children);
          break;
      }
    }
  }

  // Create source tree
  const sourceTree: FileSystemTree = await generateFileSystemTree({
    entityPath: resolve('src')
  });

  // Walk source tree
  await walkSourceTree(sourceTree?.children || []);

  log.info('Build complete');
}

export { interpolate };
