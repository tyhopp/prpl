import { log } from '@prpl/core';
import AWS from 'aws-sdk';
import { PRPLPluginAWSKeys } from '../index.js';

/**
 * Initialize AWS and S3 prior to other operations.
 * @param {PRPLPluginAWSKeys} keys
 * @returns {Promise<S3>}
 */
async function initS3(keys: PRPLPluginAWSKeys): Promise<AWS.S3> {
  const { AWSAccessKey, AWSSecretAccessKey, AWSContentBucketRegion } = keys || {};

  let s3;

  try {
    // Configure AWS
    AWS.config.update({
      accessKeyId: AWSAccessKey,
      secretAccessKey: AWSSecretAccessKey,
      region: AWSContentBucketRegion
    });

    // Initialize S3
    s3 = new AWS.S3();
  } catch (error) {
    log.error(`Failed to initialize S3. Error:`, error?.message);
  }

  return s3;
}

export { initS3 };
