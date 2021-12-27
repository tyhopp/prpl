import { Stats } from 'fs';
import { stat as nodeStat } from 'fs/promises';

/**
 * Proxy Node stat property accessors to match Deno stat behavior.
 * @param filePath string
 * @returns
 */
async function stat(filePath: string): Promise<Stats> {
  const stats = await nodeStat(filePath);

  const statsProxy = new Proxy(stats, {
    get: (target, property) => {
      switch (property) {
        case 'isFile':
          return target.isFile();
        case 'isDirectory':
          return target.isDirectory();
      }
    }
  });

  return statsProxy;
}

export { stat };
