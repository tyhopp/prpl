import path from 'path';
import { readFile } from 'fs/promises';
import { parse as parseCSS } from 'cssom';

async function constructCSSOM(filePath) {
  try {
    const buffer = await readFile(path.resolve(`sites/${filePath}`));
    const css = buffer.toString();
    return parseCSS(css);
  } catch (error) {
    console.error(error);
  }
}

export { constructCSSOM };
