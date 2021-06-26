import { resolve } from 'path';
import { writeFile } from 'fs/promises';
import { parsePRPLAttributes } from './parse-prpl-attributes.js';
import {
  PRPLFileSystemTree,
  PRPLTagAttribute,
  PRPLTag
} from '../types/prpl.js';
import { interpolatePage } from './interpolate-page.js';
import { interpolateList } from './interpolate-list.js';

/**
 * Interpolate an HTML file.
 */
async function interpolateHTML(srcTree: PRPLFileSystemTree): Promise<void> {
  // Add prefetch and router script tags
  srcTree.src = srcTree?.src?.replace(
    /<\/head>/,
    `<script defer src="prefetch.js"></script>\n<script defer src="router.js"></script>\n</head>`
  );

  // If no PRPL tags, write the file to dist
  if (!/<prpl/?.test(srcTree?.src)) {
    await writeFile(srcTree?.targetFilePath, srcTree?.src);
    return;
  }

  // If there are PRPL tags, parse
  const attrs = await parsePRPLAttributes(srcTree);
  const firstAttr = attrs?.[0];

  // Check if has PRPL page tag, if a PPRL page tag exists it should always be found first
  const firstPRPLAttrIsPage: boolean =
    firstAttr?.parsed?.[PRPLTagAttribute?.type] === PRPLTag.page;

  // If there is not a PRPL page tag, interpolate any list tags and write file
  if (firstAttr && !firstPRPLAttrIsPage) {
    // Clone the source file to avoid mutating original object
    const page = { ...srcTree };

    // Replace list fragments
    for (let a = 0; a < attrs?.length; a++) {
      const contentDir = resolve(attrs?.[a]?.parsed?.[PRPLTagAttribute?.src]);
      const listFragment = await interpolateList(
        srcTree,
        contentDir,
        attrs?.[a]?.raw
      );
      const listRegex: RegExp = new RegExp(
        `<prpl ${attrs?.[a]?.raw}>.*<\/prpl>`,
        's'
      );
      page.src = page?.src?.replace(listRegex, listFragment);
    }

    // Write page to dist
    await writeFile(page?.targetFilePath, page?.src);
    return;
  }

  // Create and interpolate page
  const contentDir = resolve(firstAttr?.parsed?.[PRPLTagAttribute?.src]);
  await interpolatePage(srcTree, contentDir, attrs);
}

export { interpolateHTML };
