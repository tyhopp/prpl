import { resolve } from 'path';
import { rm } from 'fs/promises';
import { log } from './log.js';
import { exists } from './exists.js';
import { ensureDir } from './ensure-dir.js';

/**
 * Recursively clear the dist directory.
 */
async function clearDist(): Promise<void> {
  try {
    const dist = resolve('dist');
    if (await exists(dist)) {
      await rm(dist, { recursive: true });
    }
    await ensureDir(dist);
  } catch (error) {
    log.error(`Failed to clear dist. Error:`, error?.message);
  }
}

export { clearDist };
