import { writeFile } from 'fs/promises';
import path from 'path';

async function writeSiteFile(site, filePath, dom) {
  const srcPath = path.resolve(`../${site}/${filePath}`);
  await writeFile(srcPath, dom.toString());
}

export { writeSiteFile };
