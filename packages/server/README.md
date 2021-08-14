# @prpl/server

Development server that watches local file changes and makes those updates in the browser. Usage with `@prpl/core` 
is optional.

### Dependencies

[`@prpl/server`](src/server.ts) is the only module with more than one dependency:

- [chokidar](https://github.com/paulmillr/chokidar) for watching file system changes
- [faye-websocket](https://github.com/faye/faye-websocket-node) as a websocket interface on the client and server
- [open](https://www.npmjs.com/package/open) to open the project in the browser
- [serve-handler](https://github.com/vercel/serve-handler) for routing requests and handling responses

### Usage

Run `prpl-server` from the command line in the root of your project.