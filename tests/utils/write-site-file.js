import { writeFile } from 'fs/promises';
import { resolve } from 'path';

async function writeSiteFile({ target, om }) {
  const srcPath = resolve(`sites/${target}`);
  await writeFile(srcPath, om.toString());
}

export { writeSiteFile };
