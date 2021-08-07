// noinspection JSUnusedGlobalSymbols

import { resolve } from 'path';
import { readFile, writeFile } from 'fs/promises';
import {
  generateOrRetrieveFileSystemTree,
  log,
  PRPLCache,
  PRPLCacheManager,
  PRPLCachePartitionKey,
  PRPLFileSystemTree
} from '@prpl/core';

enum PRPLPluginCSSImportsExtension {
  css = '.css'
}

enum PRPLPluginCSSImportsCachePartitionKey {
  cssImport = 'css-import'
}

/**
 * Resolve CSS import statements at build time.
 */
async function resolveCSSImports({
  cachePartitionKey
}: {
  cachePartitionKey?: string;
}): Promise<PRPLCacheManager['cache']> {
  // Define a new cache partition for HTML fragments
  if (!cachePartitionKey) {
    await PRPLCache?.define(PRPLPluginCSSImportsCachePartitionKey.cssImport);
  }

  // Resolve cache partition key
  const partitionKey = cachePartitionKey || PRPLPluginCSSImportsCachePartitionKey.cssImport;

  // Generate or retrieve dist file system tree
  const distTree = await generateOrRetrieveFileSystemTree({
    entityPath: resolve('dist'),
    partitionKey,
    readFileRegExp: new RegExp(PRPLPluginCSSImportsExtension.css)
  });

  const CSSImportRegex = new RegExp(/@import\s['"](.*?)['"];/);

  // Recursively resolve CSS imports
  async function resolveImports(
    css: string,
    resolutions: number,
    dir: string
  ): Promise<{ css: string; resolutions: number; dir: string }> {
    const firstImport = css?.match(CSSImportRegex);

    if (!firstImport) {
      return {
        css,
        resolutions,
        dir
      };
    }

    const firstImportTargetFilePath = resolve(dir, firstImport?.[1]);

    let fragment = await PRPLCache?.get(partitionKey, firstImportTargetFilePath);

    if (!fragment) {
      const fragmentFileBuffer = await readFile(resolve(dir, firstImport?.[1]));
      fragment = fragmentFileBuffer?.toString();
      await PRPLCache?.set(partitionKey, firstImportTargetFilePath, fragment);
    }

    css = css?.replace(firstImport?.[0], fragment);
    resolutions++;

    return await resolveImports(css, resolutions, dir);
  }

  // Recursively walk the dist tree depth first
  async function walkDistTree(items: PRPLFileSystemTree['children']) {
    for (let i = 0; i < items?.length; i++) {
      switch (items?.[i]?.entity) {
        case 'file':
          try {
            if (items?.[i]?.extension === PRPLPluginCSSImportsExtension.css) {
              const { css: resolvedCSSFile, resolutions } = await resolveImports(
                items?.[i]?.src,
                0,
                items?.[i]?.srcRelativeDir?.slice(1)
              );

              if (!resolutions) {
                break;
              }

              await writeFile(items?.[i]?.targetFilePath, resolvedCSSFile);
            }
          } catch (error) {
            log.error(
              `Failed to resolve any CSS imports from file '${items?.[i]?.srcRelativeFilePath}'. Error:`,
              error?.message
            );
          }
          break;
        case 'directory':
          await walkDistTree(items?.[i]?.children);
          break;
      }
    }
  }

  // Walk dist tree
  await walkDistTree(distTree?.children || []);

  log.info('Resolved CSS imports');

  // Return cache as an artifact
  return PRPLCache?.cache;
}

export { resolveCSSImports };
