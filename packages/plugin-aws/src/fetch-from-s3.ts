import { ensureDir, log } from '@prpl/core';
import { writeFile } from 'fs/promises';
import { resolve, dirname } from 'path';
import { initS3 } from './lib/init-s3.js';
import { PRPLPluginAWSKeys } from './index.js';

/**
 * Fetch files from an S3 bucket and write to the local file system.
 * @param {PRPLPluginAWSKeys} keys
 * @param {string} targetDir
 * @returns {Promise<void>}
 */
async function fetchFromS3(keys: PRPLPluginAWSKeys, targetDir?: string): Promise<void> {
  const { AWSContentBucket } = keys || {};

  const s3 = await initS3(keys);

  try {
    // Get all object metadata in bucket
    const getObjectsResponse = await s3.listObjectsV2({ Bucket: AWSContentBucket }).promise();
    const items = getObjectsResponse.Contents || [];

    // Get each object and write to local file system
    for (const item of items) {
      const { Key } = item || {};

      const getObjectResponse = await s3.getObject({ Bucket: AWSContentBucket, Key }).promise();
      const content = getObjectResponse.Body.toString();

      const targetFilePath = resolve(`/${targetDir || 'content'}/${Key}.md`);
      await ensureDir(dirname(targetFilePath));
      await writeFile(targetFilePath, content);
    }
  } catch (error) {
    log.error(
      `Failed to fetch remote content. Error:`,
      error?.message
    );
    return;
  }

  log.info('Fetched remote content');
}

export {
  fetchFromS3
}