import { writeFile } from 'fs/promises';
import { generateOrRetrieveFileSystemTree } from '../lib/generate-or-retrieve-fs-tree.js';
import { parsePRPLMetadata } from './parse-prpl-metadata.js';
import { transformMarkdown } from './transform-markdown.js';
import { interpolateList } from './interpolate-list.js';
import {
  PRPLFileSystemTree,
  PRPLContentFileExtension,
  PRPLAttributes,
  PRPLCachePartitionKey,
  PRPLFileSystemTreeEntity,
  PRPLSourceFileExtension,
  PRPLInterpolateOptions
} from '../types/prpl.js';
import { log } from '../lib/log.js';

interface InterpolatePageArgs {
  srcTree: PRPLFileSystemTree;
  contentDir: string;
  attrs: PRPLAttributes[];
  options?: PRPLInterpolateOptions;
}

/**
 * Create new pages using the source file template and content files.
 */
async function interpolatePage(args: InterpolatePageArgs): Promise<void> {
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
    const listFragment = await interpolateList({
      srcTree,
      contentDir,
      attrs: listAttrs?.[a],
      options
    });
    listFragmentMap[listAttrs?.[a]?.raw] = listFragment;
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
      targetFilePath: srcTree?.targetFilePath?.replace(
        srcTree?.name,
        contentFiles?.[p]?.name
      )
    };

    let metadata;

    // Transform to HTML if markdown and extract metadata
    switch (page?.extension) {
      case PRPLContentFileExtension.html:
        metadata = await parsePRPLMetadata(
          contentFiles?.[p]?.src,
          contentFiles?.[p]?.srcRelativeFilePath
        );
        break;
      case PRPLContentFileExtension.markdown:
        page.targetFilePath = page.targetFilePath?.replace(
          page?.extension,
          PRPLSourceFileExtension.html
        );
        page.extension = PRPLSourceFileExtension.html;
        metadata = await parsePRPLMetadata(
          contentFiles?.[p]?.src,
          contentFiles?.[p]?.srcRelativeFilePath
        );
        metadata.body = await transformMarkdown(metadata?.body);
        break;
      default:
        log.error(
          `File '${contentFiles?.[p]?.srcRelativeFilePath}' has unsupported extension '${contentFiles?.[p]?.extension}'. Supported extensions include '.html' and '.md'.`
        );
        continue pageLoop;
    }

    // Replace prior created list fragments
    for (const rawListAttrs in listFragmentMap) {
      const listRegex: RegExp = new RegExp(
        `<prpl\\s+${rawListAttrs}\\s?>.*?<\/prpl>`,
        's'
      );
      page.src = page?.src?.replace(listRegex, listFragmentMap?.[rawListAttrs]);
    }

    // Isolate <prpl> page tag inner HTML fragment
    const pageFragment = page?.src?.match(/(<prpl.*?>)(.*?)<\/prpl>/s)?.[2];

    // Interpolate the inner HTML fragment
    let pageFragmentInstance = pageFragment;

    for (const key in metadata) {
      const metadataKeyRegex =
        options?.templateRegex || new RegExp(`\\[${key}\\]`, 'g');
      pageFragmentInstance = pageFragmentInstance?.replace(
        metadataKeyRegex,
        metadata?.[key]
      );
    }

    // Write page to dist
    const interpolatedPage = page?.src.replace(
      /<prpl.*<\/prpl>/s,
      pageFragmentInstance
    );

    await writeFile(page?.targetFilePath, interpolatedPage);
  }
}

export { interpolatePage };
