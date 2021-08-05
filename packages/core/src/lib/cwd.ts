import { parse } from 'path';
import { log } from './log.js';

/**
 * Calculate the current working directory relative to the calling file.
 */
async function cwd(importMeta: ImportMeta): Promise<string> {
  try {
    const { pathname } = new URL(importMeta?.url);
    const { base } = parse(pathname);
    return pathname?.replace(base, '');
  } catch (error) {
    log.error('Failed to get current working directory. Error:', error?.message);
  }
}

export { cwd };
