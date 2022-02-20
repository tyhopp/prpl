import path from 'path';
import { readFile } from 'fs/promises';
import { parseHTML } from 'linkedom';

async function constructDOM(filePath) {
  try {
    const buffer = await readFile(path.resolve(`../test-site/dist/${filePath}`));
    const html = buffer.toString();
    return parseHTML(html);
  } catch (error) {
    console.error(error);
  }
}

export { constructDOM };
