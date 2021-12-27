import { mkdir } from 'fs/promises';
import { stat } from '../platform/stat.js';
import { log } from './log.js';

/**
 * Ensure a directory exists given an absolute path.
 */
async function ensureDir(dir: string): Promise<void> {
  try {
    const fileInfo = await stat(dir);
    if (!fileInfo.isDirectory) {
      log.error(`There is no directory at path '${dir}'.`);
    }
  } catch (error) {
    if (error?.code === 'ENOENT') {
      await mkdir(dir, { recursive: true });
      return;
    }
    log.error(`Failed to ensure '${dir}' exists. Error:`, error?.message);
  }
}

export { ensureDir };
