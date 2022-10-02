import { EOL } from 'os';
import { PRPLMetadata } from '../types/prpl.js';

/**
 * Parse PRPL metadata at the top of content files.
 */
async function parsePRPLMetadata(args: {
  src: string;
  srcRelativeFilePath: string;
}): Promise<PRPLMetadata> {
  const { src, srcRelativeFilePath } = args || {};

  let metadata;
  let body;

  try {
    const metadataStringRegex = new RegExp(`${EOL}$`, 's');
    const metadataString = /<!--(.*?)-->/s?.exec(src)?.[1]?.replace(metadataStringRegex, '');

    const metadataArrayRegex = new RegExp(`${EOL}(.*?): `, 'm');
    const metadataArray = metadataString?.split(metadataArrayRegex)?.slice(1);

    metadata = metadataArray?.reduce((acc, curr, index) => {
      if (!(index % 2)) {
        acc[curr] = metadataArray?.[index + 1];
      }
      return acc;
    }, {});

    const metadataBodyRegex = new RegExp(`-->${EOL}(.*?)$`, 's');
    body = metadataBodyRegex.exec(src)?.[1];
  } catch (error) {
    console.error(
      `Unable to parse metadata${
        srcRelativeFilePath ? ` in page ${srcRelativeFilePath}` : ''
      }. Metadata must be at the top of your file with at least a title and slug property:
    <!--
    title: Hello world!
    slug: hello-world
    -->`
    );
  }

  return {
    ...metadata,
    body
  };
}

export { parsePRPLMetadata };
