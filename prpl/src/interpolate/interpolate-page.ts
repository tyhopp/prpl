// import { parse, resolve, extname } from 'path';
// import { existsSync, lstatSync, readFileSync, writeFileSync } from 'fs';
// import { ensureDirExists } from './ensure-dir-exists.js';
// import { parsePrplMetadata } from './parse-prpl-metadata.js';
// import { transformMarkdown } from '../transforms/transform-markdown.js';

// function interpolatePage({ contentFiles, contentSrc, template }) {
//   const targetDir = template.path
//     .replace(template.name, '')
//     .replace('src', 'dist');
//   ensureDirExists(targetDir);

//   pageLoop: for (let i = 0; i < contentFiles.length; i++) {
//     let parsedContent;

//     const { dir, base: name } = parse(contentFiles[i]);
//     const relevantDir = dir.replace(resolve('.'), '');
//     const relevantPath = `${relevantDir.replace('/src', '')}/${name}`;

//     const srcPath = `${contentSrc}/${contentFiles[i]}`;
//     const targetPath = `${targetDir}${parse(contentFiles[i]).name}.html`;

//     switch (extname(contentFiles[i])) {
//       case '.html':
//         parsedContent = parsePrplMetadata(
//           readFileSync(srcPath).toString(),
//           relevantPath
//         );
//         break;
//       case '.md':
//       case '.markdown':
//         parsedContent = parsePrplMetadata(transformMarkdown(srcPath), relevantPath);
//         break;
//       default:
//         if (existsSync(srcPath) && !lstatSync(srcPath).isDirectory()) {
//           console.error(
//             `Unsupported file ${relevantPath} - supported file types include: .html, .md, .markdown`
//           );
//         }
//         continue pageLoop;
//     }

//     // Isolate src prpl template
//     const prplTemplate = template.src.match(/(<prpl.*?>)(.*?)<\/prpl>/s)[2];

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

//     // Write page to dist
//     const inerpolatedPage = template.src.replace(
//       /<prpl.*<\/prpl>/s,
//       prplTemplateInstance
//     );
//     writeFileSync(targetPath, inerpolatedPage);
//   }
// };

// export { interpolatePage };

export {};
