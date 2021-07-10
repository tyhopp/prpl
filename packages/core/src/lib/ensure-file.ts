import { dirname } from 'path';
import { stat, writeFile } from 'fs/promises';
import { ensureDir } from './ensure-dir.js';
import { log } from './log.js';

/**
 * Ensure a file exists given an absolute path.
 */
async function ensureFile(filePath: string): Promise<void> {
  try {
    const stats = await stat(filePath);
    if (!stats.isFile) {
      log.error(`There is no file at path '${filePath}'.`);
    }
  } catch (error) {
    if (error?.code === 'ENOENT') {
      await ensureDir(dirname(filePath));
      await writeFile(filePath, new Uint8Array());
      return;
    }

    log.error(`Failed to ensure '${filePath}' exists. Error:`, error?.message);
  }
}

export { ensureFile };
