import { PRPLCacheManager, PRPLCachePartitionKey } from '../types/prpl.js';
import { log } from './log.js';

/**
 * In-memory cache for file system trees.
 */
const PRPLCache: PRPLCacheManager = {
  cache: {
    [PRPLCachePartitionKey.src]: {},
    [PRPLCachePartitionKey.content]: {}
  },
  async get(partitionKey, dirPath) {
    try {
      return PRPLCache?.cache?.[partitionKey]?.[dirPath];
    } catch (error) {
      log.error(
        `Failed to get cached file system tree '${dirPath}' in partition '${partitionKey}'. Error:`,
        error?.message
      );
    }
  },
  async set(partitionKey, dirPath, fileSystemTree) {
    try {
      PRPLCache.cache[partitionKey][dirPath] = fileSystemTree;
    } catch (error) {
      log.error(
        `Failed to cache file system tree '${dirPath}' in partition '${partitionKey}'. Error:`,
        error?.message
      );
    }
  }
};

export { PRPLCache };
