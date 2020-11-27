const path = require('path');
const http = require('http');
const chokidar = require('chokidar');
const { interpolate } = require('../src/actions/interpolate');

// TODO - Implement web socket solution to push changes to client

// Serve the files on localhost
// const server = http.createServer();
// server.on('request', (request, response) => {});
// server.listen(8000);

// Watch for file changes in the src directory
chokidar.watch(path.resolve('./src')).on('change', changedPath => {
  const { dir, base: name, ext: extension } = path.parse(changedPath);
  const relevantDir = dir.replace(path.resolve('.'), '');
  const relevantPath = `${relevantDir.replace('/src', '')}/${name}`;
  const item = {
    path: changedPath,
    name,
    extension,
    type: 'file'
  };
  interpolate(item);
  console.log(`[Server] Updated ${relevantPath}`);
});