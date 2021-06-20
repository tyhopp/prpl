// import { parse, resolve } from 'path';
// import fs from 'fs';
// import { interpolateList } from './interpolate-list.js';
// import { interpolatePage } from './interpolate-page.js';
// import { extractPrplAttrs } from './extract-prpl-attrs.js';
// import { ensureDirExists } from './ensure-dir-exists.js';

// function interpolate(item) {
//   const template = {
//     ...item,
//     src: fs.readFileSync(item.path).toString()
//   };
//   const depth = item.path.replace(`${resolve('src')}/`, '').split('/');
//   depth.pop();
//   const root = depth.reduce((acc) => acc + '../', '');

//   // Add prefetch and router script tags
//   template.src = template.src.replace(
//     /<\/head>/,
//     `<script defer src="${root}prefetch.js"></script>\n<script defer src="${root}router.js"></script>\n</head>`
//   );

//   const targetPath = item.path.replace('src', 'dist');
//   const targetDir = targetPath.replace(item.name, '');

//   const { dir, base: name } = parse(item.path);
//   const relevantDir = dir.replace(resolve('.'), '');
//   const relevantPath = `${relevantDir.replace('/src', '')}/${name}`;

//   if (!/<prpl/.test(template.src)) {
//     ensureDirExists(targetDir);
//     fs.writeFileSync(targetPath, template.src);
//     return;
//   }

//   const { prplAttrs, prplAttrsRaw } = extractPrplAttrs(template.src);

//   const contentType = prplAttrs['type'];
//   const contentSrc = resolve(prplAttrs['src']);

//   if (
//     !fs.existsSync(contentSrc) ||
//     !fs
//       .readdirSync(contentSrc, { withFileTypes: true })
//       .filter((item) => !item.isDirectory()).length
//   ) {
//     console.log(
//       `No content files found in <prpl ${prplAttrsRaw}> in ${relevantPath}`
//     );
//     ensureDirExists(targetDir);
//     fs.writeFileSync(targetPath, template.src);
//     return;
//   }

//   const contentFiles = fs.readdirSync(contentSrc);

//   switch (contentType) {
//     case 'list':
//       interpolateList({ contentFiles, contentSrc, template });
//       break;
//     case 'page':
//       interpolatePage({ contentFiles, contentSrc, template });
//       break;
//     default:
//       interpolatePage({ contentFiles, contentSrc, template });
//   }
// }

// export { interpolate };

export {};
