import { resolve } from 'path';
import { readFile } from 'fs/promises';
import { DOMParser, parseHTML } from 'linkedom';

async function constructDOM({ src, type = 'file', mimeType = 'text/html' }) {
  try {
    let data = src;

    if (type === 'file') {
      const buffer = await readFile(resolve(`sites/${src}`));
      data = buffer.toString();
    }

    if (mimeType === 'text/html') {
      return parseHTML(data);
    }

    const parser = new DOMParser();
    return {
      document: parser.parseFromString(data, mimeType)
    };
  } catch (error) {
    console.error(error);
  }
}
export { constructDOM };
