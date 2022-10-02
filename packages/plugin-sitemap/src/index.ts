import { resolve, parse, sep, join } from 'path';
import { writeFile } from 'fs/promises';
import {
  generateOrRetrieveFileSystemTree,
  log,
  PRPLCache,
  PRPLCacheManager,
  PRPLCachePartitionKey,
  PRPLFileSystemTree
} from '@prpl/core';

enum PRPLPluginSitemapExtension {
  html = '.html'
}

enum PRPLPluginSitemapCachePartitionKey {
  sitemap = 'plugin-sitemap'
}

/**
 * Generate a sitemap.
 */
async function generateSitemap(args: {
  origin: string;
  ignoreDirRegex?: RegExp;
  cachePartitionKey?: PRPLCachePartitionKey | string;
}): Promise<PRPLCacheManager['cache']> {
  const { origin, ignoreDirRegex, cachePartitionKey } = args || {};

  // Define a new cache partition if one is not provided
  if (!cachePartitionKey) {
    await PRPLCache?.define(PRPLPluginSitemapCachePartitionKey.sitemap);
  }

  // Resolve cache partition key
  const partitionKey = cachePartitionKey || PRPLPluginSitemapCachePartitionKey.sitemap;

  // Generate or retrieve dist file system tree
  const distTree = await generateOrRetrieveFileSystemTree({
    entityPath: resolve('dist'),
    partitionKey
  });

  let urls = '';

  const urlTemplate = `
  <url>
    <loc>[url]</loc>
    <lastmod>[date]</lastmod>
    <priority>1.0</priority>
  </url>
  `;

  // Calculate W3C date
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const w3cMonth = month < 10 ? `0${month}` : month;
  const date = `${year}-${w3cMonth}-${day}`;

  // Recursively walk the dist tree depth first
  async function walkDistTree(items: PRPLFileSystemTree['children']) {
    for (let i = 0; i < items?.length; i++) {
      switch (items?.[i]?.entity) {
        case 'file':
          try {
            if (ignoreDirRegex && ignoreDirRegex?.test(items?.[i]?.srcRelativeDir)) {
              break;
            }

            if (items?.[i]?.extension !== PRPLPluginSitemapExtension.html) {
              break;
            }

            let urlTemplateInstance = String(urlTemplate);

            const { dir, name } = parse(items?.[i]?.srcRelativeFilePath);
            const distRelativeDir = dir.split(sep).slice(1).join(sep);
            const slug = join(distRelativeDir, name);

            // TODO: Remove, this is a debug log for Windows CI
            console.log(items?.[i], { slug });

            const templateKeys = {
              url: slug === 'index' ? origin : `${origin}/${slug}`,
              date
            };

            for (const key in templateKeys) {
              if (urlTemplateInstance.includes(`[${key}]`)) {
                const regex = new RegExp(`\\[${key}\\]`, 'g');
                urlTemplateInstance = urlTemplateInstance.replace(regex, templateKeys[key]);
              }
            }

            urls = `${urls}${urlTemplateInstance}`;
          } catch (error) {
            log.error(
              `Failed to resolve sitemap url from file '${items?.[i]?.srcRelativeFilePath}'. Error:`,
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

  // TODO: Remove, this is a debug log for Windows CI
  console.log({ urls });

  const sitemap = `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
    ${urls}
  </urlset>`;

  await writeFile(resolve('dist', 'sitemap.xml'), sitemap);

  log.info('Generated sitemap');

  // Return cache as an artifact
  return PRPLCache?.cache;
}

export { generateSitemap };
