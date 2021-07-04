import { readdir } from 'fs/promises';

/**
 * Read only directories that have access permission.
 */
async function readDirSafe(dirPath: string): Promise<string[]> {
  let dirData = null;
  try {
    dirData = await readdir(dirPath);
  } catch (error) {
    if (error?.code == 'EACCES' || error?.code == 'EPERM') {
      return dirData;
    } else {
      throw error;
    }
  }
  return dirData;
}

export { readDirSafe };
