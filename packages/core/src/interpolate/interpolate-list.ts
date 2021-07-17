import { generateOrRetrieveFileSystemTree } from '../lib/generate-or-retrieve-fs-tree.js';
import { parsePRPLMetadata } from './parse-prpl-metadata.js';
import { PRPLAttributes } from '../types/prpl.js';
import {
  PRPLFileSystemTree,
  PRPLContentFileExtension,
  PRPLFileSystemTreeEntity,
  PRPLTagAttribute,
  PRPLDirectionAttributeValue,
  PRPLMetadata,
  PRPLCachePartitionKey,
  PRPLInterpolateOptions
} from '../types/prpl.js';
import { log } from '../lib/log.js';

interface InterpolateListArgs {
  srcTree: PRPLFileSystemTree;
  contentDir: string;
  attrs: PRPLAttributes;
  options?: PRPLInterpolateOptions;
}

/**
 * Interpolate content into an inline HTML fragment.
 */
async function interpolateList(args: InterpolateListArgs): Promise<string> {
  const { srcTree, contentDir, attrs, options = {} } = args || {};

  // Generate or retrieve content tree
  const contentTreeReadFileRegExp = new RegExp(
    `${PRPLContentFileExtension.html}|${PRPLContentFileExtension.markdown}`
  );
  const contentTree = await generateOrRetrieveFileSystemTree({
    partitionKey: PRPLCachePartitionKey.content,
    entityPath: contentDir,
    readFileRegExp: contentTreeReadFileRegExp
  });
  const contentFiles = contentTree?.children || [];

  // Construct regex with pattern
  const listRegex: RegExp = new RegExp(
    `(<prpl\\s+${attrs?.raw}\\s?>)(.*?)<\/prpl>`,
    's'
  );

  // Isolate src prpl template
  const PRPLListTemplate = srcTree?.src?.match(listRegex)?.[2];

  // Create a list of parsed metadata and interpolated list fragment
  let fragmentList: {
    metadata: PRPLMetadata;
    fragment: string;
  }[] = [];

  listLoop: for (let i = 0; i < contentFiles?.length; i++) {
    // Skip child directories, interpolation is always shallow
    if (contentFiles?.[i]?.entity === PRPLFileSystemTreeEntity.directory) {
      continue listLoop;
    }

    let metadata;

    switch (contentFiles?.[i]?.extension) {
      case PRPLContentFileExtension.html:
      case PRPLContentFileExtension.markdown:
        metadata = await parsePRPLMetadata({
          src: contentFiles?.[i]?.src,
          srcRelativeFilePath: contentFiles?.[i]?.srcRelativeFilePath
        });
        break;
      default:
        log.error(
          `Unsupported content file extension '${contentFiles?.[i]?.extension}' from '${contentFiles?.[i]?.srcRelativeFilePath}'. Supported content file extensions include: '.html' and '.md'.`
        );
        fragmentList?.push({
          metadata: {},
          fragment: ''
        });
        continue;
    }

    // Fill src prpl template with content
    let prplTemplateInstance = String(PRPLListTemplate);

    for (const key in metadata) {
      const regex =
        typeof options?.templateRegex === 'function'
          ? options?.templateRegex(key)
          : new RegExp(`\\[${key}\\]`, 'g');
      prplTemplateInstance = prplTemplateInstance?.replace(
        regex,
        metadata?.[key]
      );
    }

    fragmentList?.push({
      metadata,
      fragment: prplTemplateInstance
    });
  }

  if (PRPLTagAttribute.sortBy in attrs?.parsed) {
    const sort = attrs?.parsed?.[PRPLTagAttribute.sortBy];
    let direction =
      attrs?.parsed?.[PRPLTagAttribute.direction] ||
      PRPLDirectionAttributeValue.asc;

    try {
      fragmentList = fragmentList?.sort((first, second) => {
        let firstComparator: string | number = first?.metadata?.[sort];
        let secondComparator: string | number = second?.metadata?.[sort];

        // TODO - Create sorts enum
        if (sort?.toLowerCase() === 'date' || sort?.toLowerCase() === 'time') {
          firstComparator = new Date(firstComparator)?.getTime();
          secondComparator = new Date(secondComparator)?.getTime();

          return direction === PRPLDirectionAttributeValue.asc
            ? firstComparator - secondComparator
            : secondComparator - firstComparator;
        }

        if (firstComparator === secondComparator) {
          return 0;
        }

        return direction === PRPLDirectionAttributeValue.asc
          ? firstComparator > secondComparator
            ? 1
            : -1
          : secondComparator < firstComparator
          ? -1
          : 1;
      });
    } catch (error) {
      log.error(
        `Failed to sort by '${sort}' in ${srcTree?.srcRelativeFilePath}. Error:`,
        error?.message
      );
    }
  }

  if (PRPLTagAttribute.limit in attrs?.parsed) {
    const limit = Number(attrs?.parsed?.[PRPLTagAttribute.limit]);
    try {
      fragmentList = fragmentList?.slice(0, limit);
    } catch (error) {
      log.error(
        `Failed to limit to '${limit}' in ${srcTree?.srcRelativeFilePath}. Error:`,
        error?.message
      );
    }
  }

  const joinedFragmentList = fragmentList
    ?.map((item) => item?.fragment)
    .join('');

  return joinedFragmentList;
}

export { interpolateList };
