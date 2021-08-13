import { initS3 } from './lib/init-s3.js';
import { log, parsePRPLMetadata } from '@prpl/core';
import { PRPLPluginAWSKeys, PRPLPluginAWSUploadFile } from './index.js';

/**
 * Upload file(s) to an S3 bucket.
 * @param {PRPLPluginAWSKeys} keys
 * @param {PRPLPluginAWSUploadFile[]} files
 * @returns {Promise<void>}
 */
async function uploadToS3(
  keys: PRPLPluginAWSKeys,
  files: PRPLPluginAWSUploadFile[]
): Promise<void> {
  const { AWSContentBucket } = keys || {};

  const s3 = await initS3(keys);

  try {
    for (const { src, srcRelativeFilePath } of files) {
      const { slug } = await parsePRPLMetadata({
        src,
        srcRelativeFilePath
      });

      // Upload to S3
      await s3
        .putObject({
          Bucket: AWSContentBucket,
          Key: slug,
          Body: src
        })
        .promise();
    }
  } catch (error) {
    log.error(`Failed to upload content. Error:`, error?.message);
    return;
  }

  log.info('Uploaded content');
}

export { uploadToS3 };
