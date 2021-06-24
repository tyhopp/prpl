import { PRPLRequiredMetadata } from '../types/prpl.js';

async function parsePRPLMetadata(
  src: string,
  relevantFilePath: string
): Promise<Record<PRPLRequiredMetadata | string, string>> {
  let metadata;
  let body;

  try {
    // Parse metadata
    const metadataString = /<\!--(.*?)-->/s.exec(src)[1].replace(/\n$/s, '');
    const metadataArray = metadataString.split(/\n(.*?): /m).slice(1);
    metadata = metadataArray.reduce((acc, curr, index) => {
      if (!(index % 2)) {
        acc[curr] = metadataArray[index + 1];
      }
      return acc;
    }, {});

    // Parse html
    body = /-->\n(.*?)$/s.exec(src)[1];
  } catch (error) {
    console.error(
      `Unable to parse metadata in page ${relevantFilePath}. Metadata must be at the top of your file with at least a title and slug property:
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
