import { readFile, stat } from 'fs/promises';
import { basename, extname, join, parse, resolve } from 'path';
import { PRPLFileSystemTree, PRPLFileSystemTreeEntity } from '../types/prpl.js';
import { readDirSafe } from './read-dir-safe.js';

export interface PRPLGenerateFileSystemTreeArgs {
  entityPath: string;
  readFileRegExp?: RegExp;
}

/**
 * Generate a recursive file system tree.
 */
async function generateFileSystemTree(
  args: PRPLGenerateFileSystemTreeArgs
): Promise<PRPLFileSystemTree> {
  const { entityPath, readFileRegExp } = args;

  const name = basename(entityPath);
  const path = entityPath?.replace(/\\/g, '/');

  const item: PRPLFileSystemTree = {
    path,
    name,
    entity: null
  };

  let stats;

  try {
    stats = await stat(path);
  } catch (_) {
    return null;
  }

  if (stats?.isFile()) {
    const { dir, base: name } = parse(path);

    item.srcRelativeDir = dir?.replace(resolve('.'), '');
    item.srcRelativeFilePath = `${item?.srcRelativeDir?.replace('/src', '')}/${name}`;

    item.targetFilePath = path?.replace('src', 'dist');
    item.targetDir = parse(item?.targetFilePath)?.dir;

    item.extension = extname(path)?.toLowerCase();
    item.entity = PRPLFileSystemTreeEntity.file;

    try {
      if (typeof readFileRegExp === 'object' && readFileRegExp?.constructor == RegExp) {
        if (readFileRegExp?.test(item?.extension)) {
          const srcBuffer = await readFile(item?.path);
          item.src = srcBuffer?.toString();
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
      const child = await generateFileSystemTree({
        entityPath: join(item?.path, entitiesInDirectory?.[i]),
        readFileRegExp
      });
      item?.children?.push(child);
    }

    item.entity = PRPLFileSystemTreeEntity.directory;

    return item;
  }

  return null;
}

export { generateFileSystemTree };
