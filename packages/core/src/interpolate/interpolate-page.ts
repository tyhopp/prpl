import { writeFile } from 'fs/promises';
import { generateOrRetrieveFileSystemTree } from '../lib/generate-or-retrieve-fs-tree.js';
import { log } from '../lib/log.js';
import {
  PRPLAttributes,
  PRPLCachePartitionKey,
  PRPLContentFileExtension,
  PRPLFileSystemTree,
  PRPLFileSystemTreeEntity,
  PRPLInterpolateOptions,
  PRPLSourceFileExtension
} from '../types/prpl.js';
import { interpolateList } from './interpolate-list.js';
import { parsePRPLMetadata } from './parse-prpl-metadata.js';
import { transformMarkdown } from './transform-markdown.js';

/**
 * Create new pages using the source file template and content files.
 */
async function interpolatePage(args: {
  srcTree: PRPLFileSystemTree;
  contentDir: string;
  attrs: PRPLAttributes[];
  options?: PRPLInterpolateOptions;
}): Promise<void> {
  const { srcTree, contentDir, attrs = [], options = {} } = args || {};

  // Generate or retrieve content tree
  const contentTreeReadFileRegExp = new RegExp(
    `${PRPLContentFileExtension.html}|${PRPLContentFileExtension.markdown}`
  );
  const contentTree = await generateOrRetrieveFileSystemTree({
    partitionKey: PRPLCachePartitionKey.content,
    entityPath: contentDir,
    readFileRegExp: contentTreeReadFileRegExp
  });
  const contentFiles = contentTree?.children || [];

  const listAttrs = attrs?.slice(1);

  // Create list fragment map for replacement later
  let listFragmentMap: Record<string, string> = {};

  for (let a = 0; a < listAttrs?.length; a++) {
    listFragmentMap[listAttrs?.[a]?.raw] = await interpolateList({
      srcTree,
      contentDir,
      attrs: listAttrs?.[a],
      options
    });
  }

  // Create pages
  pageLoop: for (let p = 0; p < contentFiles?.length; p++) {
    // Skip child directories, interpolation is always shallow
    if (contentFiles?.[p]?.entity === PRPLFileSystemTreeEntity.directory) {
      continue pageLoop;
    }

    // Create page instance from source and content tree
    const page = {
      ...srcTree,
      name: contentFiles?.[p]?.name,
      extension: contentFiles?.[p]?.extension,
      targetFilePath: srcTree?.targetFilePath?.replace(srcTree?.name, contentFiles?.[p]?.name)
    };

    let metadata;

    // Transform to HTML if markdown and extract metadata
    switch (page?.extension) {
      case PRPLContentFileExtension.html:
        metadata = await parsePRPLMetadata({
          src: contentFiles?.[p]?.src,
          srcRelativeFilePath: contentFiles?.[p]?.srcRelativeFilePath
        });
        break;
      case PRPLContentFileExtension.markdown:
        page.targetFilePath = page.targetFilePath?.replace(
          page?.extension,
          PRPLSourceFileExtension.html
        );
        page.extension = PRPLSourceFileExtension.html;
        metadata = await parsePRPLMetadata({
          src: contentFiles?.[p]?.src,
          srcRelativeFilePath: contentFiles?.[p]?.srcRelativeFilePath
        });
        metadata.body = await transformMarkdown({
          markdown: metadata?.body,
          options
        });
        break;
      default:
        log.error(
          `File '${contentFiles?.[p]?.srcRelativeFilePath}' has unsupported extension '${contentFiles?.[p]?.extension}'. Supported extensions include '.html' and '.md'.`
        );
        continue pageLoop;
    }

    // Replace prior created list fragments
    for (const rawListAttrs in listFragmentMap) {
      const listRegex: RegExp = new RegExp(`<prpl\\s+${rawListAttrs}\\s?>.*?<\/prpl>`, 's');
      page.src = page?.src?.replace(listRegex, listFragmentMap?.[rawListAttrs]);
    }

    // Interpolate the inner HTML fragment
    let pageFragmentInstance = page?.src?.match(/(<prpl.*?>)(.*?)<\/prpl>/s)?.[2];

    for (const key in metadata) {
      const metadataKeyRegex =
        typeof options?.templateRegex === 'function'
          ? options?.templateRegex(key)
          : new RegExp(`\\[${key}\\]`, 'g');
      pageFragmentInstance = pageFragmentInstance?.replace(metadataKeyRegex, metadata?.[key]);
    }

    // Write page to dist
    const interpolatedPage = page?.src.replace(/<prpl.*<\/prpl>/s, pageFragmentInstance);

    await writeFile(page?.targetFilePath, interpolatedPage);
  }
}

export { interpolatePage };
