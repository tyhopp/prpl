import {
  generateOrRetrieveFileSystemTree,
  log,
  PRPLCache,
  PRPLCacheManager,
  parsePRPLMetadata,
  PRPLContentFileExtension
} from '@prpl/core';
import { writeFile } from 'fs/promises';
import { resolve, relative } from 'path';

/**
 * Generate an RSS feed from items in a directory.
 */
async function generateRSSFeed(args: {
  dir: string;
  feedTitle: string;
  author: string;
  origin: string;
  iconFilePath?: string;
}): Promise<PRPLCacheManager['cache']> {
  const { dir, feedTitle = '', author = '', origin = '', iconFilePath = '' } = args || {};

  let entries = '';

  const entryTemplate = `
  <entry>
    <id>[url]</id>
    <published>[isoDate]</published>
    <updated>[isoDate]</updated>
    <title>[title]</title>
    <link rel="alternate" type="text/html" href="[url]"></link>
    <author>
      <name>${author}</name>
    </author>
    <summary>[description]</summary>
    <content type="text/html" src="[url]"></content>
  </entry>
  `;

  const partitionKey = relative(resolve(), resolve(dir));

  // Define a new cache partition
  await PRPLCache?.define(partitionKey);

  // Generate file system tree
  const contentTree = await generateOrRetrieveFileSystemTree({
    entityPath: resolve(dir),
    partitionKey,
    readFileRegExp: new RegExp(
      `${PRPLContentFileExtension.html}|${PRPLContentFileExtension.markdown}`
    )
  });

  let files = [];

  // Extract metadata out of files
  for (const { src, srcRelativeFilePath } of contentTree?.children) {
    const metadata = await parsePRPLMetadata({
      src,
      srcRelativeFilePath
    });

    files.push(metadata);
  }

  // Sort files by date if there is one
  let sortedFiles = files?.sort((a, b) => {
    if (a?.date && b?.date) {
      return new Date(b?.date)?.getTime() - new Date(a?.date)?.getTime();
    } else {
      return 0;
    }
  });

  // Construct entries from files
  for (const file of sortedFiles) {
    const { title, slug, date, description } = file || {};

    const rawDate = new Date(date);
    const isoDate = rawDate?.toISOString();
    const url = `${origin}/${slug}`;

    const adjustedKeys = {
      url,
      isoDate,
      title,
      description
    };

    let entryInstance = String(entryTemplate);

    for (const key in adjustedKeys) {
      if (entryInstance?.includes(`[${key}]`)) {
        const regex = new RegExp(`\\[${key}\\]`, 'g');
        entryInstance = entryInstance.replace(regex, adjustedKeys?.[key]);
      }
    }

    entries = `${entries}${entryInstance}`;
  }

  const now = new Date();
  const updated = now.toISOString();

  // Construct feed
  const feed = `<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="en">
    <title>${feedTitle}</title>
    <icon>${iconFilePath}</icon>
    <link type="text/html" href="${origin}" rel="alternate"/>
    <updated>${updated}</updated>
    <author>
      <name>${author}</name>
    </author>
    <id>${origin}/rss.xml</id>
    ${entries}
  </feed>`;

  await writeFile(resolve('dist/rss.xml'), feed);

  log.info('Generated RSS feed');

  // Return cache as an artifact
  return PRPLCache?.cache;
}

export { generateRSSFeed };
