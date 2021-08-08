// noinspection JSUnusedGlobalSymbols

import { resolve } from 'path';
import { writeFile } from 'fs/promises';
import {
  generateOrRetrieveFileSystemTree,
  log,
  PRPLCache,
  PRPLCacheManager,
  PRPLCachePartitionKey,
  PRPLFileSystemTree
} from '@prpl/core';

/**
 * Prism does not support ES module import syntax.
 * @see {@link https://github.com/PrismJS/prism/issues/2155}
 */
const prism = require('prismjs');
const loadLanguages = require('prismjs/components/');

enum PRPLPluginCodeHighlightExtension {
  html = '.html'
}

enum PRPLPluginCodeHighlightCachePartitionKey {
  codeHighlight = 'plugin-code-highlight'
}

/**
 * Highlight code blocks with Prism.
 */
async function highlightCode(args?: {
  cachePartitionKey?: PRPLCachePartitionKey | string;
}): Promise<PRPLCacheManager['cache']> {
  const { cachePartitionKey } = args || {};

  // Define a new cache partition if one is not provided
  if (!cachePartitionKey) {
    await PRPLCache?.define(PRPLPluginCodeHighlightCachePartitionKey.codeHighlight);
  }

  // Resolve cache partition key
  const partitionKey = cachePartitionKey || PRPLPluginCodeHighlightCachePartitionKey.codeHighlight;

  // Generate or retrieve dist file system tree
  const distTree = await generateOrRetrieveFileSystemTree({
    entityPath: resolve('dist'),
    partitionKey,
    readFileRegExp: new RegExp(PRPLPluginCodeHighlightExtension.html)
  });

  // Collection of loaded languages
  let loadedLanguages = [];

  // Recursively walk the dist tree depth first
  async function walkDistTree(items: PRPLFileSystemTree['children']) {
    for (let i = 0; i < items?.length; i++) {
      switch (items?.[i]?.entity) {
        case 'file':
          try {
            if (items?.[i]?.extension !== PRPLPluginCodeHighlightExtension.html) {
              break;
            }

            const codeBlocks = [
              ...items?.[i]?.src?.matchAll(/<code class="language-(.*?)">(.*?)<\/code>/gs)
            ];

            if (!codeBlocks?.length) {
              break;
            }

            for (const [block, language, code] of codeBlocks) {
              // Load language in prism if it is not already
              if (!loadedLanguages?.includes(language)) {
                loadLanguages(language);
                loadedLanguages?.push(language);
              }

              // Highlight code
              const highlightedCode = prism?.highlight(code, prism?.languages[language], language);

              // Reconstruct block
              const reconstructedBlock = `<code class="language-${language}">${highlightedCode}</code>`;

              // Replace block in original html
              items[i].src = items?.[i]?.src?.replace(block, reconstructedBlock);
            }

            // Write file
            await writeFile(items?.[i]?.targetFilePath, items?.[i]?.src);
          } catch (error) {
            log.error(
              `Failed to highlight code block in file '${items?.[i]?.srcRelativeFilePath}'. Error:`,
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

  // Walk dist tree to generate sitemap urls
  await walkDistTree(distTree?.children || []);

  log.info('Highlighted code');

  // Return cache as an artifact
  return PRPLCache?.cache;
}

export { highlightCode };
