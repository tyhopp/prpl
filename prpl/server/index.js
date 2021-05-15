#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const http = require('http');
const handler = require('serve-handler');
const WebSocket = require('faye-websocket');
const chokidar = require('chokidar');
const open = require('open');
const { interpolate } = require('../src/actions/interpolate');

let ws;
let socketInjectedPages = [];

/**
 * Injects the socket on the page if it does not already have it.
 * @param {string} page
 */
function injectSocketOptionally(page) {
  const pageDOM = fs.readFileSync(path.resolve(page)).toString();

  if (pageDOM.includes('<script dev>')) {
    return;
  }

  const socket = fs
    .readFileSync(path.resolve(__dirname, 'socket.js'))
    .toString();

  const injectedPageDOM = pageDOM.replace(
    /<\/head>/,
    `<script dev>
      ${socket}
    </script>
  </body>`
  );

  socketInjectedPages.push(page);

  fs.writeFileSync(path.resolve(page), injectedPageDOM);
}

// Serve the files on localhost
const server = http.createServer();

// Inject socket on index page
server.on('connection', () => {
  injectSocketOptionally('./dist/index.html');
});

// Clean up pages injected with socket
process.on('SIGINT', () => {
  socketInjectedPages.forEach((page) => {
    const injectedPageDOM = fs.readFileSync(path.resolve(page)).toString();
    const restoredPageDOM = injectedPageDOM.replace(
      /<script dev>.*<\/script>/s,
      ''
    );
    fs.writeFileSync(path.resolve(page), restoredPageDOM);
  });
  socketInjectedPages = [];
  process.exit(0);
});

server.on('request', (request, response) => {
  if (request.headers.accept.includes('text/html')) {
    const url =
      request.url === '/' ? './dist/index.html' : `./dist${request.url}.html`;
    injectSocketOptionally(url);
  }

  const config = {
    public: 'dist',
    cleanUrls: true,
    trailingSlash: false
  };

  return handler(request, response, config);
});

server.on('upgrade', (request, socket, head) => {
  ws = new WebSocket(request, socket, head);
});

server.listen(8000);

// Watch for file changes in the src directory
const watcher = chokidar.watch(path.resolve('./src'));

watcher.on('change', (changedPath) => {
  const { dir, base: name, ext: extension } = path.parse(changedPath);
  const relevantDir = dir.replace(path.resolve('.'), '');
  const relevantPath = `${relevantDir.replace('/src', '')}/${name}`;
  const item = {
    path: changedPath,
    name,
    extension,
    type: 'file'
  };
  Promise.resolve()
    .then(() => {
      interpolate(item);
    })
    .then(() => {
      ws.send(relevantPath === '/index.html' ? '/' : relevantPath);
    })
    .then(() => {
      console.log(`[Server] Updated ${relevantPath}`);
    });
});

open('http://localhost:8000');
