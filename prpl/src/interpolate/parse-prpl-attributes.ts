import { PRPLFileSystemTree, PRPLAttributes } from '../types/prpl.js';

/**
 * Parse attributes from a <prpl> tag.
 */
async function parsePRPLAttributes(
  srcTree: PRPLFileSystemTree
): Promise<PRPLAttributes[]> {
  const prplAttrs = [...srcTree?.src?.matchAll(/<prpl(.*?)>/g)]
    .map((attrs) => attrs?.[1]?.trim())
    .reduce((attrsCollection, attrs) => {
      attrsCollection?.push({
        raw: attrs,
        parsed: [...attrs?.matchAll(/\s*((.*?)="(.*?)")/g)]?.reduce(
          (acc, curr) => {
            return {
              ...acc,
              [curr?.[2]]: curr?.[3]
            };
          },
          {}
        )
      });

      return attrsCollection;
    }, []);

  return prplAttrs;
}

export { parsePRPLAttributes };
