import { PRPLContentFileExtension } from '../types/prpl.js';
import {
  generateFileSystemTree,
  FileSystemTree
} from '../lib/generate-fs-tree.js';
import { ContentCache } from '../lib/content-cache.js';
import { log } from './log.js';

/**
 * Fetch content tree from cache or generate a new one.
 */
async function generateContentFileSystemTree(
  contentSrcDir: string
): Promise<FileSystemTree> {
  try {
    let contentTree = null;
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

    return contentTree;
  } catch (error) {
    log.error(
      `Failed generate content file system tree from ${contentSrcDir}. Error:`,
      error?.message
    );
  }
}

export { generateContentFileSystemTree };
