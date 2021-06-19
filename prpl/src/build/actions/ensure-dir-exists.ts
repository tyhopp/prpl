import { existsSync, mkdirSync } from 'fs';
import { resolve } from 'path';

function ensureDirExists(dir) {
  if (!existsSync(resolve(dir))) {
    mkdirSync(resolve(dir), { recursive: true });
  }
}

export { ensureDirExists };
