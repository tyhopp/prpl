// import path from 'path';
// import fs from 'fs';
// import http from 'http';
// import handler from 'serve-handler';
// import WebSocket from 'faye-websocket';
// import chokidar from 'chokidar';
// import open from 'open';
// import { interpolate } from '../build/actions/interpolate.js';
// import { copyFileToDist } from '../build/actions/copy-file-to-dist.js';

// // Colorize console messages
// const builtInLog = console.log;
// const builtInError = console.error;
// console.log = function () {
//   builtInLog('\x1b[35m', '[PRPL]', ...arguments, '\x1b[0m');
// };
// console.error = function () {
//   builtInError('\x1b[35m', '[PRPL]', ...arguments, '\x1b[0m');
// };

// let ws;
// let socketInjectedPages = [];

// /**
//  * Inject the socket on the page if it does not already have it.
//  * @param {string} page
//  */
// function injectSocketOptionally(page) {
//   if (!fs.existsSync(path.resolve(page))) {
//     return;
//   }

//   const pageDOM = fs.readFileSync(path.resolve(page)).toString();

//   if (pageDOM.includes('<script dev>')) {
//     return;
//   }

//   const socket = fs
//     .readFileSync(path.resolve(__dirname, 'socket.js'))
//     .toString();

//   const injectedPageDOM = pageDOM.replace(
//     /<\/head>/,
//     `<script dev>
//       ${socket}
//     </script>
//   </body>`
//   );

//   socketInjectedPages.push(page);

//   fs.writeFileSync(path.resolve(page), injectedPageDOM);
// }

// // Serve the files on localhost
// const server = http.createServer();

// // Inject socket on index page
// server.on('connection', () => {
//   injectSocketOptionally('./dist/index.html');
// });

// // Clean up pages injected with socket
// process.on('SIGINT', () => {
//   socketInjectedPages.forEach((page) => {
//     const injectedPageDOM = fs.readFileSync(path.resolve(page)).toString();
//     const restoredPageDOM = injectedPageDOM.replace(
//       /<script dev>.*<\/script>/s,
//       ''
//     );
//     fs.writeFileSync(path.resolve(page), restoredPageDOM);
//   });
//   socketInjectedPages = [];
//   process.exit(0);
// });

// server.on('request', (request, response) => {
//   if (request.headers.accept.includes('text/html')) {
//     const url =
//       request.url === '/' ? './dist/index.html' : `./dist${request.url}.html`;
//     injectSocketOptionally(url);
//   }

//   const config = {
//     public: 'dist',
//     cleanUrls: true,
//     trailingSlash: false
//   };

//   return handler(request, response, config);
// });

// server.on('upgrade', (request, socket, head) => {
//   ws = new WebSocket(request, socket, head);
// });

// server.listen(8000);

// // Watch for file changes in the src directory
// const watcher = chokidar.watch(path.resolve('./src'), {
//   ignoreInitial: true
// });

// /**
//  * Create new or update existing source code file.
//  * @param {string} changedPath
//  * @param {string} event
//  */
// function createOrUpdateFile(changedPath, event) {
//   const { dir, base: name, ext: extension } = path.parse(changedPath);
//   const relevantDir = dir.replace(path.resolve('.'), '');
//   const relevantPath = `${relevantDir.replace('/src', '')}/${name}`;
//   const item = {
//     path: changedPath,
//     name,
//     extension,
//     type: 'file'
//   };

//   try {
//     Promise.resolve()
//       .then(() => {
//         if (extension === '.html') {
//           interpolate(item);
//           return;
//         }
//         copyFileToDist(item);
//       })
//       .then(() => {
//         ws.send(relevantPath === '/index.html' ? '/' : relevantPath);
//       })
//       .then(() => {
//         console.log(
//           `${event === 'change' ? 'Updated' : 'Created'} ${relevantPath}`
//         );
//       });
//   } catch (error) {
//     console.error(
//       `Server failed to ${
//         event === 'change' ? 'update' : 'create'
//       } ${relevantPath}`
//     );
//   }
// }

// /**
//  * Remove source code file from dist.
//  * @param {string} changedPath
//  */
// function removeFile(changedPath) {
//   const { dir, base: name } = path.parse(changedPath);
//   const relevantDir = dir.replace(path.resolve('.'), '');
//   const relevantPath = `${relevantDir.replace('/src', '')}/${name}`;
//   const distPath = `${dir.replace('/src', '/dist')}/${name}`;

//   try {
//     if (fs.existsSync(distPath)) {
//       fs.rmSync(distPath);
//       console.log(`Removed ${relevantPath}`);
//     }
//   } catch (error) {
//     console.error(`Server failed to remove ${relevantPath}`);
//   }
// }

// watcher
//   .on('change', (changedPath) => {
//     createOrUpdateFile(changedPath, 'change');
//   })
//   .on('add', (changedPath) => {
//     createOrUpdateFile(changedPath, 'add');
//   })
//   .on('unlink', (changedPath) => {
//     removeFile(changedPath);
//   });

// open('http://localhost:8000');

// console.log('Server listening at http://localhost:8000');

export {};
