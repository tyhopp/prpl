import { resolve } from 'path';
import { copyFile } from 'fs/promises';
import { generateOrRetrieveFileSystemTree } from '../lib/generate-or-retrieve-fs-tree.js';
import { log } from '../lib/log.js';
import { cwd } from '../lib/cwd.js';
import {
  PRPLClientScript,
  PRPLSourceFileExtension,
  PRPLFileSystemTree,
  PRPLCacheManager,
  PRPLCachePartitionKey,
  PRPLInterpolateOptions
} from '../types/prpl.js';
import { ensureDir } from '../lib/ensure-dir.js';
import { interpolateHTML } from './interpolate-html.js';
import { PRPLCache } from '../lib/cache.js';

const PRPLClientScripts: PRPLClientScript[] = [
  PRPLClientScript.prefetch,
  PRPLClientScript.prefetchWorker,
  PRPLClientScript.router
];

interface InterpolateArgs {
  options?: PRPLInterpolateOptions;
}

/**
 * Initialize recursive interpolation.
 */
async function interpolate(
  args: InterpolateArgs
): Promise<PRPLCacheManager['cache']> {
  const { options = {} } = args || {};

  // Make sure dist exists
  await ensureDir(resolve('dist'));

  // Add PRPL client scripts to dist
  if (!options?.noClientJS) {
    for (let s = 0; s < PRPLClientScripts.length; s++) {
      try {
        await copyFile(
          resolve(await cwd(import.meta), `client/${PRPLClientScripts[s]}.js`),
          resolve(`dist/${PRPLClientScripts[s]}.js`)
        );
      } catch (error) {
        log.error(
          `Failed to copy '${PRPLClientScripts[s]}.js' to dist. Error:`,
          error?.message
        );
      }
    }
  }

  // Recursively walk the source tree depth first
  async function walkSourceTree(items: PRPLFileSystemTree['children']) {
    for (let i = 0; i < items.length; i++) {
      switch (items?.[i]?.entity) {
        case 'file':
          await ensureDir(items?.[i]?.targetDir);

          if (items?.[i]?.extension === PRPLSourceFileExtension.html) {
            await interpolateHTML({ srcTree: items?.[i], options });
            break;
          }

          try {
            await copyFile(items?.[i]?.path, items?.[i]?.targetFilePath);
          } catch (error) {
            log.error(
              `Failed to copy '${items?.[i]?.srcRelativeFilePath}' to dist. Error:`,
              error?.message
            );
          }
          break;
        case 'directory':
          walkSourceTree(items?.[i]?.children);
          break;
      }
    }
  }

  const srcDir = resolve('src');
  const srcTreeReadFileRegExp = new RegExp(PRPLSourceFileExtension.html);

  // Create source tree
  const srcTree: PRPLFileSystemTree = await generateOrRetrieveFileSystemTree({
    partitionKey: PRPLCachePartitionKey.src,
    entityPath: srcDir,
    readFileRegExp: srcTreeReadFileRegExp
  });

  // Walk source tree
  await walkSourceTree(srcTree?.children || []);

  log.info('Build complete');

  // Return cache as an artifact
  return PRPLCache?.cache;
}

export { interpolate };
