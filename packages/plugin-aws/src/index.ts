export interface PRPLPluginAWSKeys {
  AWSAccessKey: string;
  AWSSecretAccessKey: string;
  AWSContentBucket: string;
  AWSContentBucketRegion: string;
}

export interface PRPLPluginAWSUploadFile {
  src: string;
  srcRelativeFilePath: string;
}

export { fetchFromS3 } from './fetch-from-s3.js';
export { uploadToS3 } from './upload-to-s3.js';