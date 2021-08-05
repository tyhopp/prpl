import { resolve } from 'path';
import { writeFile } from 'fs/promises';
import { parsePRPLAttributes } from './parse-prpl-attributes.js';
import {
  PRPLFileSystemTree,
  PRPLTagAttribute,
  PRPLTag,
  PRPLInterpolateOptions
} from '../types/prpl.js';
import { interpolatePage } from './interpolate-page.js';
import { interpolateList } from './interpolate-list.js';

/**
 * Interpolate an HTML file.
 */
async function interpolateHTML(args: {
  srcTree: PRPLFileSystemTree;
  options?: PRPLInterpolateOptions;
}): Promise<void> {
  const { srcTree, options = {} } = args || {};

  // Add prefetch and router script tags
  if (!options?.noClientJS) {
    srcTree.src = srcTree?.src?.replace(
      /<\/head>/,
      `<script type="module" src="prefetch.js"></script>\n<script type="module" src="router.js"></script>\n</head>`
    );
  }

  // If no PRPL tags, write the file to dist
  if (!/<prpl/?.test(srcTree?.src)) {
    await writeFile(srcTree?.targetFilePath, srcTree?.src);
    return;
  }

  // If there are PRPL tags, parse
  const attrs = await parsePRPLAttributes({ html: srcTree?.src });
  const firstAttr = attrs?.[0];

  // Check if has PRPL page tag, if a PPRL page tag exists it should always be found first
  const firstPRPLAttrIsPage: boolean = firstAttr?.parsed?.[PRPLTagAttribute?.type] === PRPLTag.page;

  // If there is not a PRPL page tag, interpolate any list tags and write file
  if (firstAttr && !firstPRPLAttrIsPage) {
    // Clone the source file to avoid mutating original object
    const page = { ...srcTree };

    // Replace list fragments
    for (let a = 0; a < attrs?.length; a++) {
      const contentDir = resolve(attrs?.[a]?.parsed?.[PRPLTagAttribute?.src]);
      const listFragment = await interpolateList({
        srcTree,
        contentDir,
        attrs: attrs?.[a],
        options
      });
      const listRegex: RegExp = new RegExp(`<prpl\\s+${attrs?.[a]?.raw}\\s?>.*<\/prpl>`, 's');
      page.src = page?.src?.replace(listRegex, listFragment);
    }

    // Write page to dist
    await writeFile(page?.targetFilePath, page?.src);
    return;
  }

  // Create and interpolate page
  const contentDir = resolve(firstAttr?.parsed?.[PRPLTagAttribute?.src]);
  await interpolatePage({
    srcTree,
    contentDir,
    attrs,
    options
  });
}

export { interpolateHTML };
