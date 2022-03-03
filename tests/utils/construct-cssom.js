import { resolve } from 'path';
import { readFile } from 'fs/promises';
import { parse as parseCSS } from 'cssom';

async function constructCSSOM({ src, type = 'file' }) {
  try {
    let css = src;

    if (type === 'file') {
      const buffer = await readFile(resolve(`sites/${src}`));
      css = buffer.toString();
    }

    return parseCSS(css);
  } catch (error) {
    console.error(error);
  }
}

export { constructCSSOM };
