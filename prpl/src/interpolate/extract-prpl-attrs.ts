// function extractPrplAttrs(page) {
//   const prplAttrs = [...page.matchAll(/<prpl(.*?)>/g)]
//     .map((attrs) => attrs[1].trim())
//     .reduce((attrsCollection, attrs) => {
//       attrsCollection.push({
//         rawAttrs: attrs,
//         parsedAttrs: [...attrs.matchAll(/\s*((.*?)="(.*?)")/g)].reduce(
//           (acc, curr) => {
//             return {
//               ...acc,
//               [curr[2]]: curr[3]
//             };
//           },
//           {}
//         )
//       });

//       return attrsCollection;
//     }, []);

//   return prplAttrs;
// }

// export { extractPrplAttrs };

export {};