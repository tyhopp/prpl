import { FileSystemTree } from './generate-fs-tree';

interface PRPLContentCache {
  content: Record<string, FileSystemTree>;
  getContent: (contentSrcDir: string) => Promise<FileSystemTree>;
  setContent: (
    contentSrcDir: string,
    contentTree: FileSystemTree
  ) => Promise<void>;
}

/**
 * In-memory cache for content file system trees.
 */
const ContentCache: PRPLContentCache = {
  content: {},
  async getContent(contentSrcDir) {
    return ContentCache?.content?.[contentSrcDir];
  },
  async setContent(contentSrcDir, contentTree) {
    ContentCache.content[contentSrcDir] = contentTree;
  }
};

export { ContentCache };
