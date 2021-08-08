import {
  generateOrRetrieveFileSystemTree,
  log,
  PRPLCache,
  PRPLCacheManager,
  PRPLCachePartitionKey
} from '@prpl/core';

/**
 * Create a new cache partition.
 */
async function createCachePartition({
  entityPath,
  partitionKey,
  readFileRegExp
}: {
  entityPath: string;
  partitionKey: PRPLCachePartitionKey | string;
  readFileRegExp: RegExp | any;
}): Promise<PRPLCacheManager['cache']> {
  // Define a new cache partition
  await PRPLCache?.define(partitionKey);

  // Generate or retrieve new cache tree
  await generateOrRetrieveFileSystemTree({
    entityPath,
    partitionKey,
    readFileRegExp
  });

  log.info(`Created cache partition ${partitionKey}`);

  // Return cache as an artifact
  return PRPLCache?.cache;
}

export { createCachePartition };
