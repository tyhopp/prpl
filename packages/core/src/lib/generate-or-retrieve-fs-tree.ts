import { generateFileSystemTree, PRPLGenerateFileSystemTreeArgs } from './generate-fs-tree.js';
import { PRPLCache } from './cache.js';
import { log } from './log.js';
import { PRPLFileSystemTree, PRPLCachePartitionKey } from '../types/prpl.js';

interface PRPLRetrieveOrGenerateFileSystemTreeArgs extends PRPLGenerateFileSystemTreeArgs {
  partitionKey: PRPLCachePartitionKey | string;
}

/**
 * Retrieve a cached file system tree or generate and cache a new one.
 */
async function generateOrRetrieveFileSystemTree(
  args: PRPLRetrieveOrGenerateFileSystemTreeArgs
): Promise<PRPLFileSystemTree> {
  const { partitionKey, entityPath, readFileRegExp } = args;

  try {
    let fileSystemTree = await PRPLCache?.get(partitionKey, entityPath);

    if (!fileSystemTree) {
      fileSystemTree = await generateFileSystemTree({
        entityPath,
        readFileRegExp
      });
      await PRPLCache?.set(partitionKey, entityPath, fileSystemTree);
    }

    return fileSystemTree;
  } catch (error) {
    log.error(`Failed generate file system tree from '${entityPath}'. Error:`, error?.message);
  }
}

export { generateOrRetrieveFileSystemTree };
