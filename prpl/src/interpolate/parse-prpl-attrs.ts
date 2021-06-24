import { PRPLTagAttribute } from '../types/prpl.js';

type ParsedPRPLAttr = {
  [key in PRPLTagAttribute]: string;
};

type ParsedPRPLAttrs = {
  rawAttrs: string;
  parsedAttrs: ParsedPRPLAttr[];
};

async function parsePRPLAttrs(src: string): Promise<ParsedPRPLAttrs[]> {
  const prplAttrs = [...src?.matchAll(/<prpl(.*?)>/g)]
    .map((attrs) => attrs?.[1]?.trim())
    .reduce((attrsCollection, attrs) => {
      attrsCollection?.push({
        rawAttrs: attrs,
        parsedAttrs: [...attrs?.matchAll(/\s*((.*?)="(.*?)")/g)]?.reduce(
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

export { parsePRPLAttrs };
