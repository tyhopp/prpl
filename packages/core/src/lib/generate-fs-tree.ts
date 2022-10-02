import { readFile, stat } from 'fs/promises';
import { basename, extname, join, parse, resolve, sep } from 'path';
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

  const item: PRPLFileSystemTree = {
    path: entityPath,
    name,
    entity: null
  };

  let stats;

  try {
    stats = await stat(entityPath);
  } catch (_) {
    return null;
  }

  if (stats?.isFile()) {
    const { dir, base } = parse(entityPath);

    item.srcRelativeDir = dir?.replace(resolve('.'), '');
    item.srcRelativeFilePath = `${item?.srcRelativeDir.split(sep).slice(1).join(sep)}${sep}${base}`;

    item.targetFilePath = entityPath?.replace('src', 'dist');
    item.targetDir = parse(item?.targetFilePath)?.dir;

    item.extension = extname(entityPath)?.toLowerCase();
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
