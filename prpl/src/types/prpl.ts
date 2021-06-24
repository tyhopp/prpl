import { FileSystemTree } from '../lib/generate-fs-tree';

export enum PRPLSourceFileExtension {
  html = '.html'
}

export enum PRPLContentFileExtension {
  html = '.html',
  markdown = '.md'
}

export enum PRPLClientScript {
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

export interface PRPLSourceFileDTO extends FileSystemTree {
  srcRelativeDir: string;
  srcRelativeFilePath: string;
  targetFilePath: string;
  targetDir: string;
}
