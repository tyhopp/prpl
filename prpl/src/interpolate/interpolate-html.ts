import { resolve } from 'path';
import { copyFile } from 'fs/promises';
import { parsePRPLAttrs } from './parse-prpl-attrs.js';
import {
  PRPLContentFileExtension,
  PRPLSourceFileDTO,
  PRPLTagAttribute
} from '../types/prpl.js';
import { generateFileSystemTree } from '../lib/generate-fs-tree.js';
import { ContentCache } from '../lib/content-cache.js';

async function interpolateHTML(
  sourceFileDTO: PRPLSourceFileDTO
): Promise<void> {
  // Add prefetch and router script tags
  sourceFileDTO.src = sourceFileDTO?.src?.replace(
    /<\/head>/,
    `<script defer src="${resolve()}prefetch.js"></script>\n<script defer src="${resolve()}router.js"></script>\n</head>`
  );

  // If no PRPL tags, copy the file to dist
  if (!/<prpl/?.test(sourceFileDTO?.src)) {
    await copyFile(sourceFileDTO?.path, sourceFileDTO?.targetFilePath);
    return;
  }

  // If there are PRPL tags, parse
  const parsedPRPLAttrs = await parsePRPLAttrs(sourceFileDTO.src);
  const firstPRPLAttr = parsedPRPLAttrs?.[0];

  // Check if has PRPL page tag, if a PPRL page tag exists it should always be found first
  // const isPRPLPage: boolean =
  //   firstPRPLAttr?.parsedAttrs?.[PRPLTagAttribute?.type] === PRPLTag.page;

  // If there is a PRPL page tag, resolve the content tree
  const contentSrcDir = resolve(
    firstPRPLAttr?.parsedAttrs?.[PRPLTagAttribute?.src]
  );

  let contentTree = null;

  // Use cached content tree or generate a new one
  const cachedContentTree = await ContentCache?.getContent(contentSrcDir);
  if (cachedContentTree) {
    contentTree = cachedContentTree;
  } else {
    const contentTreeReadFileRegExp = new RegExp(
      `/${PRPLContentFileExtension.html}|${PRPLContentFileExtension.markdown}/`
    );
    contentTree = await generateFileSystemTree({
      entityPath: contentSrcDir,
      readFileRegExp: contentTreeReadFileRegExp
    });
    await ContentCache?.setContent(contentSrcDir, contentTree);
  }

  // If no content files, log error and copy the source file to dist
  if (!contentTree?.children?.length) {
    // TODO
  }

  // if (
  //   !fs.existsSync(contentSrc) ||
  //   !fs
  //     .readdirSync(contentSrc, { withFileTypes: true })
  //     .filter((item) => !item.isDirectory()).length
  // ) {
  //   console.log(
  //     `No content files found in <prpl ${prplAttrsRaw}> in ${relevantPath}`
  //   );
  //   ensureDir(targetDir);
  //   fs.writeFileSync(targetPath, sourceFileDTO.src);
  //   return;
  // }

  // const contentFiles = fs.readdirSync(contentSrc);

  // switch (contentType) {
  //   case 'list':
  //     interpolateList({ contentFiles, contentSrc, sourceFileDTO });
  //     break;
  //   case 'page':
  //     interpolatePage({ contentFiles, contentSrc, sourceFileDTO });
  //     break;
  //   default:
  //     interpolatePage({ contentFiles, contentSrc, sourceFileDTO });
  // }
}

export { interpolateHTML };
