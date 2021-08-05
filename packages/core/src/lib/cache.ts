import { PRPLCacheManager, PRPLCachePartitionKey } from '../types/prpl.js';
import { log } from './log.js';

/**
 * In-memory cache for file system trees and user-defined objects.
 */
const PRPLCache: PRPLCacheManager = {
  cache: {
    [PRPLCachePartitionKey.src]: {},
    [PRPLCachePartitionKey.content]: {},
    [PRPLCachePartitionKey.dist]: {}
  },
  async define(partitionKey) {
    try {
      PRPLCache.cache[partitionKey] = {};
    } catch (error) {
      log.error(`Failed to define a new partition '${partitionKey}'. Error:`, error?.message);
    }
  },
  async get(partitionKey, dirPath) {
    try {
      return PRPLCache?.cache?.[partitionKey]?.[dirPath];
    } catch (error) {
      log.error(
        `Failed to get cached item '${dirPath}' in partition '${partitionKey}'. Error:`,
        error?.message
      );
    }
  },
  async set(partitionKey, dirPath, item) {
    try {
      PRPLCache.cache[partitionKey][dirPath] = item;
    } catch (error) {
      log.error(
        `Failed to cache item '${dirPath}' in partition '${partitionKey}'. Error:`,
        error?.message
      );
    }
  }
};

export { PRPLCache };
