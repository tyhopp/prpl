import { parse } from 'path';
import { fileURLToPath } from 'url';
import { log } from './log.js';

/**
 * Calculate the current working directory relative to the calling file.
 */
async function cwd(importMeta: ImportMeta): Promise<string> {
  try {
    return parse(fileURLToPath(importMeta.url)).dir;
  } catch (error) {
    log.error('Failed to get current working directory. Error:', error?.message);
  }
}

export { cwd };
