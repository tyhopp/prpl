import { PRPLFileSystemTree, PRPLMetadata } from '../types/prpl.js';

/**
 * Parse PRPL metadata at the top of content files.
 */
async function parsePRPLMetadata(
  contentTree: PRPLFileSystemTree
): Promise<PRPLMetadata> {
  let metadata;
  let body;

  try {
    const metadataString = /<\!--(.*?)-->/s
      ?.exec(contentTree?.src)?.[1]
      ?.replace(/\n$/s, '');
    const metadataArray = metadataString?.split(/\n(.*?): /m)?.slice(1);
    metadata = metadataArray?.reduce((acc, curr, index) => {
      if (!(index % 2)) {
        acc[curr] = metadataArray?.[index + 1];
      }
      return acc;
    }, {});
    body = /-->\n(.*?)$/s?.exec(contentTree?.src)?.[1];
  } catch (error) {
    console.error(
      `Unable to parse metadata in page ${contentTree?.srcRelativeFilePath}. Metadata must be at the top of your file with at least a title and slug property:
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
