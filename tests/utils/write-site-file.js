import { writeFile } from 'fs/promises';
import path from 'path';

async function writeSiteFile(filePath, dom) {
  const srcPath = path.resolve(`sites/${filePath}`);
  await writeFile(srcPath, dom.toString());
}

export { writeSiteFile };
