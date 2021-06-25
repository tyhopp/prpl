import { stat } from 'fs/promises';
import { log } from './log.js';

/**
 * Check whether an entity exists given an absolute path.
 */
async function exists(filePath: string): Promise<boolean> {
  try {
    await stat(filePath);
    return true;
  } catch (error) {
    if (error?.code === 'ENOENT') {
      return false;
    }

    log.error(`Failed to check ${filePath} exists. Error:`, error?.message);
  }
}

export { exists };
