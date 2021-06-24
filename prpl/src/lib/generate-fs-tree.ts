import { readFile, stat } from 'fs/promises';
import { basename, extname, join } from 'path';
import { readDirSafe } from './read-dir-safe.js';

export enum FileSystemTreeEntity {
  directory = 'directory',
  file = 'file'
}

export interface GenerateFileSystemTreeArgs {
  entityPath: string;
  readFileRegExp?: RegExp;
}

export interface FileSystemTree {
  path: string;
  name: string;
  type: FileSystemTreeEntity;
  extension?: string;
  src?: string;
  children?: FileSystemTree[];
}

async function generateFileSystemTree(
  args: GenerateFileSystemTreeArgs
): Promise<FileSystemTree> {
  const { entityPath, readFileRegExp } = args;

  const name = basename(entityPath);
  const path = entityPath?.replace(/\\/g, '/');

  const item: FileSystemTree = {
    path,
    name,
    type: null
  };

  let stats;

  try {
    stats = await stat(path);
  } catch (_) {
    return null;
  }

  if (stats?.isFile()) {
    item.extension = extname(path)?.toLowerCase();
    item.type = FileSystemTreeEntity.file;

    try {
      if (
        typeof readFileRegExp === 'object' &&
        readFileRegExp?.constructor == RegExp
      ) {
        if (readFileRegExp?.test(item?.extension)) {
          item.src = await readFile(item?.path)?.toString();
        }
      }
      return item;
    } catch (_) {}
  }

  if (stats?.isDirectory()) {
    let entitiesInDirectory = await readDirSafe(item?.path);

    if (entitiesInDirectory === null) {
      return null;
    }

    item.children = [];

    for (let i = 0; i < entitiesInDirectory?.length; i++) {
      item?.children?.push(
        await generateFileSystemTree({
          entityPath: join(item?.path, entitiesInDirectory?.[i]),
          readFileRegExp
        })
      );
    }

    item.type = FileSystemTreeEntity.directory;

    return item;
  }

  return null;
}

export { generateFileSystemTree };
