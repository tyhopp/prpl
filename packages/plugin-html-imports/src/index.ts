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

enum PRPLPluginHTMLImportsExtension {
  html = '.html'
}

enum PRPLPluginHTMLImportsCachePartitionKey {
  htmlImport = 'plugin-html-imports'
}

/**
 * Resolve HTML import statements at build time.
 */
async function resolveHTMLImports(args?: {
  cachePartitionKey?: PRPLCachePartitionKey | string;
}): Promise<PRPLCacheManager['cache']> {
  const { cachePartitionKey } = args || {};

  // Define a new cache partition for HTML fragments
  if (!cachePartitionKey) {
    await PRPLCache?.define(PRPLPluginHTMLImportsCachePartitionKey.htmlImport);
  }

  // Resolve cache partition key
  const partitionKey = cachePartitionKey || PRPLPluginHTMLImportsCachePartitionKey.htmlImport;

  // Generate or retrieve dist file system tree
  const distTree = await generateOrRetrieveFileSystemTree({
    entityPath: resolve('dist'),
    partitionKey,
    readFileRegExp: new RegExp(PRPLPluginHTMLImportsExtension.html)
  });

  const HTMLImportRegex = new RegExp(/<link\s+rel="import"\s+href="(.*?)"\s?\/>/s);

  // Recursively resolve or retrieve cached HTML import fragments
  async function resolveImports(
    html: string,
    resolutions: number
  ): Promise<{ html: string; resolutions: number }> {
    const firstImport = html?.match(HTMLImportRegex);

    if (!firstImport) {
      return {
        html,
        resolutions
      };
    }

    const firstImportTargetFilePath = resolve('dist', firstImport?.[1]);

    let fragment = await PRPLCache?.get(partitionKey, firstImportTargetFilePath);

    if (!fragment) {
      const fragmentFileBuffer = await readFile(resolve('dist', firstImport?.[1]));
      fragment = fragmentFileBuffer?.toString();
      await PRPLCache?.set(partitionKey, firstImportTargetFilePath, fragment);
    }

    html = html?.replace(firstImport?.[0], fragment);
    resolutions++;

    return await resolveImports(html, resolutions);
  }

  // Recursively walk the dist tree depth first
  async function walkDistTree(items: PRPLFileSystemTree['children']) {
    for (let i = 0; i < items?.length; i++) {
      switch (items?.[i]?.entity) {
        case 'file':
          try {
            if (items?.[i]?.extension === PRPLPluginHTMLImportsExtension.html) {
              const { html: resolvedHTMLFile, resolutions } = await resolveImports(
                items?.[i]?.src,
                0
              );

              if (!resolutions) {
                break;
              }

              await writeFile(items?.[i]?.targetFilePath, resolvedHTMLFile);
            }
          } catch (error) {
            log.error(
              `Failed to resolve any HTML imports from file '${items?.[i]?.srcRelativeFilePath}'. Error:`,
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

  log.info('Resolved HTML imports');

  // Return cache as an artifact
  return PRPLCache?.cache;
}

export { resolveHTMLImports };
