import { resolve, join } from 'path';
import { writeFile } from 'fs/promises';
import {
  generateOrRetrieveFileSystemTree,
  log,
  PRPLCache,
  PRPLCacheManager,
  PRPLCachePartitionKey,
  PRPLFileSystemTree
} from '@prpl/core';
import hljs from 'highlight.js/lib/core';
import { escape } from 'html-escaper';

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

            const mappedAliases = {
              html: 'xml'
            };

            const escapedLanguages = {
              xml: true
            };

            for (let [block, language, code] of codeBlocks) {
              language = mappedAliases?.[language] ?? language;

              const languagePath = join('highlight.js', 'lib', 'languages', language);
              const languageRegistered = Boolean(hljs?.getLanguage(language));

              // Register language if it is not already
              if (!languageRegistered) {
                const { default: languageGrammar } = await import(languagePath);

                if (typeof languageGrammar !== 'function') {
                  log.error(`Failed to load language grammar for ${language}`);
                  return;
                }

                hljs?.registerLanguage(language, languageGrammar);
              }

              code = escapedLanguages?.[code] ? escape(code) : code;

              // Highlight code
              const highlightedCode = hljs?.highlight(code, { language })?.value;

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
