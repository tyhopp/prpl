import path from 'path';
import { readFile } from 'fs/promises';
import { DOMParser } from 'linkedom';

async function constructDOM(filePath, mimeType = 'text/html') {
  try {
    const buffer = await readFile(path.resolve(`../test-site/dist/${filePath}`));
    const string = buffer.toString();
    const parser = new DOMParser();
    return parser.parseFromString(string, mimeType);
  } catch (error) {
    console.error(error);
  }
}

export { constructDOM };
