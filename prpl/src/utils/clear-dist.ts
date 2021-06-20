import { resolve } from 'path';
import { rmdir } from 'fs/promises';
import { log } from './log.js';
import { exists } from './exists.js';
import { ensureDir } from './ensure-dir.js';

async function clearDist(): Promise<void> {
  try {
    const dist = resolve('dist');
    if (await exists(dist)) {
      await rmdir(dist, { recursive: true });
    }
    await ensureDir(dist);
  } catch (error) {
    log.error(`Failed to clear dist. Error:`, error?.message);
  }
}

export { clearDist };
