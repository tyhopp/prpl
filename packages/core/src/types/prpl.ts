import { MarkedOptions } from 'marked';

export enum PRPLSourceFileExtension {
  html = '.html'
}

export enum PRPLContentFileExtension {
  html = '.html',
  markdown = '.md'
}

export const enum PRPLClientScript {
  prefetch = 'prefetch',
  prefetchWorker = 'prefetch-worker',
  router = 'router'
}

export enum PRPLTag {
  page = 'page',
  list = 'list'
}

export enum PRPLTagAttribute {
  type = 'type',
  src = 'src',
  sortBy = 'sort-by',
  direction = 'direction',
  limit = 'limit'
}

export enum PRPLDirectionAttributeValue {
  asc = 'asc',
  desc = 'desc'
}

export enum PRPLRequiredMetadata {
  title = 'title',
  slug = 'slug'
}

export type PRPLMetadata = Record<PRPLRequiredMetadata | string, string>;

export enum PRPLFileSystemTreeEntity {
  directory = 'directory',
  file = 'file'
}

export interface PRPLFileSystemTree {
  path: string;
  name: string;
  entity: PRPLFileSystemTreeEntity;
  extension?: string;
  src?: string;
  children?: PRPLFileSystemTree[];
  srcRelativeDir?: string;
  srcRelativeFilePath?: string;
  targetFilePath?: string;
  targetDir?: string;
}

export enum PRPLCachePartitionKey {
  src = 'src',
  content = 'content',
  dist = 'dist'
}

export type PRPLCachePartition = Record<string, PRPLFileSystemTree>;

export interface PRPLCacheManager {
  cache: Record<PRPLCachePartitionKey | string, PRPLCachePartition | any>;
  define: (partitionKey: string) => Promise<void>;
  get: (
    partitionKey: PRPLCachePartitionKey | string,
    dirPath: string
  ) => Promise<PRPLFileSystemTree | any>;
  set: (
    partitionKey: PRPLCachePartitionKey | string,
    dirpath: string,
    item: PRPLFileSystemTree | any
  ) => Promise<void>;
}

export type PRPLAttributeMap = {
  [key in PRPLTagAttribute]: string;
};

export type PRPLAttributes = {
  raw: string;
  parsed: PRPLAttributeMap;
};

export type PRPLClientStorageItem = {
  storageKey: string;
  storageValue: string;
};

export const enum PRPLClientEvent {
  render = 'prpl-render'
}

export const enum PRPLClientPerformanceMark {
  renderStart = 'prpl-render-start',
  renderEnd = 'prpl-render-end'
}

export interface PRPLInterpolateOptions {
  noClientJS?: boolean;
  templateRegex?: RegExp;
  markedOptions?: MarkedOptions;
}