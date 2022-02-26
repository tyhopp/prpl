import path from 'path';
import { readFile } from 'fs/promises';
import { DOMParser } from 'linkedom';

async function constructDOMFromFile(filePath, mimeType = 'text/html') {
  try {
    const buffer = await readFile(path.resolve(`sites/${filePath}`));
    const string = buffer.toString();
    const parser = new DOMParser();
    return parser.parseFromString(string, mimeType);
  } catch (error) {
    console.error(error);
  }
}

async function constructDOMFromString(html, mimeType = 'text/html') {
  try {
    const parser = new DOMParser();
    return parser.parseFromString(html, mimeType);
  } catch (error) {
    console.error(error);
  }
}

export { constructDOMFromFile, constructDOMFromString };
