// import { resolve, parse, extname } from 'path';
// import { existsSync, lstatSync, readFileSync, writeFileSync } from 'fs';
// import { ensureDirExists } from './ensure-dir-exists.js';
// import { parsePrplMetadata } from './parse-prpl-metadata.js';
// import { extractPrplAttrs } from './extract-prpl-attrs.js';

// function interpolateList({ contentFiles, contentSrc, template }) {
//   let files = contentFiles;

//   const targetPath = template.path.replace('src', 'dist');
//   const targetDir = targetPath.replace(template.name, '');
//   ensureDirExists(targetDir);

//   // Isolate src prpl template
//   const prplTemplate = template.src.match(/(<prpl.*?>)(.*?)<\/prpl>/s)[2];

//   // Fill metadata in list item template
//   let list = files.map((file) => {
//     let parsedContent;

//     const { dir, base: name } = parse(file);
//     const relevantDir = dir.replace(resolve('.'), '');
//     const relevantPath = `${relevantDir.replace('/src', '')}/${name}`;

//     const srcPath = `${contentSrc}/${file}`;

//     switch (extname(file)) {
//       case '.html':
//       case '.md':
//       case '.markdown':
//         parsedContent = parsePrplMetadata(
//           readFileSync(srcPath).toString(),
//           relevantPath
//         );
//         break;
//       default:
//         if (existsSync(srcPath) && !lstatSync(srcPath).isDirectory()) {
//           console.error(
//             `Unsupported file ${relevantPath} - supported file types include: .html, .md, .markdown`
//           );
//         }
//         return {
//           parsedContent: {},
//           output: ''
//         };
//     }

//     // Fill src prpl template with content
//     let prplTemplateInstance = String(prplTemplate);
//     for (const key in parsedContent) {
//       if (prplTemplateInstance.includes(`[${key}]`)) {
//         const regex = new RegExp(`\\[${key}\\]`, 'g');
//         prplTemplateInstance = prplTemplateInstance.replace(
//           regex,
//           parsedContent[key]
//         );
//       }
//     }

//     return {
//       parsedContent,
//       output: prplTemplateInstance
//     };
//   });

//   const { prplAttrs } = extractPrplAttrs(template.src);

//   if ('sort-by' in prplAttrs) {
//     const sort = prplAttrs['sort-by'];
//     let direction = 'asc';

//     if ('direction' in prplAttrs) {
//       direction = prplAttrs['direction'];
//     }

//     try {
//       list = list.sort((first, second) => {
//         let firstComparator = first.parsedContent[sort];
//         let secondComparator = second.parsedContent[sort];

//         if (sort.toLowerCase() === 'date' || sort.toLowerCase() === 'time') {
//           firstComparator = new Date(firstComparator).getTime();
//           secondComparator = new Date(secondComparator).getTime();

//           return direction === 'asc'
//             ? firstComparator - secondComparator
//             : secondComparator - firstComparator;
//         }

//         if (firstComparator === secondComparator) {
//           return 0;
//         }

//         return direction === 'asc'
//           ? firstComparator > secondComparator
//             ? 1
//             : -1
//           : secondComparator < firstComparator
//           ? -1
//           : 1;
//       });
//     } catch (error) {
//       console.error(`Failed to sort by ${sort}`);
//     }
//   }

//   if ('limit' in prplAttrs) {
//     const limit = prplAttrs['limit'];
//     try {
//       list = list.slice(0, limit);
//     } catch (error) {
//       console.error(`Failed to limit to ${limit}`);
//     }
//   }

//   list = list.map((item) => item.output).join('');

//   const templateWithList = template.src.replace(/<prpl.*<\/prpl>/s, list);
//   writeFileSync(targetPath, templateWithList);
// }

// export { interpolateList };

export {};