import { resolve } from 'path';
import { readFile, writeFile, copyFile, rm } from 'fs/promises';
import http, { IncomingMessage, ServerResponse } from 'http';
import { Socket } from 'net';
import handler from 'serve-handler';
import WebSocket from 'faye-websocket';
import chokidar from 'chokidar';
import open from 'open';
import {
  interpolateHTML,
  generateFileSystemTree,
  PRPLFileSystemTree,
  PRPLSourceFileExtension,
  ensureDir,
  exists,
  cwd,
  log
} from '@prpl/core';

let ws;
let socketInjectedPages: string[] = [];

let buildId: string;

/**
 * Start the local dev server.
 */
async function server(): Promise<void> {
  // Serve the files on localhost
  const server = http.createServer();

  // Inject socket on index page
  server.on('connection', async (): Promise<void> => {
    const index = './dist/index.html';
    buildId = await getBuildId(index);
    await injectSocketOptionally(index);
  });

  // Handle requests
  server.on(
    'request',
    async (request: IncomingMessage, response: ServerResponse): Promise<void> => {
      if (request?.headers?.accept?.includes('text/html')) {
        const url = request?.url === '/' ? './dist/index.html' : `./dist${request.url}.html`;
        await injectSocketOptionally(url);
      }

      const config = {
        public: 'dist',
        cleanUrls: true,
        trailingSlash: false
      };

      return handler(request, response, config);
    }
  );

  // Upgrade connection to websocket
  server.on(
    'upgrade',
    async (request: IncomingMessage, socket: Socket, head: Buffer): Promise<void> => {
      ws = new WebSocket(request, socket, head);
    }
  );

  // Listen on port 8000
  server.listen(8000);

  // Watch for file changes in the src directory
  const watcher = chokidar?.watch(resolve('./src'), {
    ignoreInitial: true
  });

  watcher
    .on('change', async (changedFilePath: string) => {
      await createOrUpdateFile(changedFilePath, 'change');
    })
    .on('add', async (changedFilePath: string) => {
      await createOrUpdateFile(changedFilePath, 'add');
    })
    .on('unlink', async (changedFilePath: string) => {
      await removeFile(changedFilePath);
    });

  // Clean up pages injected with socket
  process.on('SIGINT', async (): Promise<void> => {
    for (let i = 0; i < socketInjectedPages?.length; i++) {
      const pageBuffer = await readFile(resolve(socketInjectedPages?.[i]));
      const injectedPage = pageBuffer?.toString();
      const restoredPage = injectedPage?.replace(/<script dev>.*<\/script>/s, '');
      await writeFile(socketInjectedPages?.[i], restoredPage);
    }
    socketInjectedPages = [];
    process.exit(0);
  });

  await open('http://localhost:8000');

  log.info('Server listening at http://localhost:8000');
}

/**
 * Get the build id once on connect so we can use it when handling page updates or creation.
 */
async function getBuildId(filePath: string): Promise<string> {
  const pageExists = await exists(filePath);
  if (!pageExists) {
    return;
  }
  const pageBuffer = await readFile(resolve(filePath));
  let page = pageBuffer?.toString();
  const [, buildId] = page?.match(/\<meta\sname=\"prpl-build-id\"\scontent=\"(.*?)\"\>/) || [];
  return buildId;
}

/**
 * Inject the socket on the page if it does not already have it.
 */
async function injectSocketOptionally(filePath: string): Promise<void> {
  const pageExists = await exists(filePath);
  if (!pageExists) {
    return;
  }

  const pageBuffer = await readFile(resolve(filePath));
  let page = pageBuffer?.toString();

  if (page?.includes('<script dev>')) {
    return;
  }

  const socketBuffer = await readFile(resolve(await cwd(import.meta), 'socket.js'));
  const socket = socketBuffer?.toString();

  page = page?.replace(
    /<\/head>/,
    `<script dev>
      ${socket}
    </script>
  </head>`
  );

  socketInjectedPages?.push(filePath);

  await writeFile(resolve(filePath), page);
}

/**
 * Create a new or update an existing file in dist.
 */
async function createOrUpdateFile(changedFilePath: string, event: string): Promise<void> {
  const item: PRPLFileSystemTree = await generateFileSystemTree({
    entityPath: changedFilePath,
    readFileRegExp: new RegExp(PRPLSourceFileExtension.html)
  });

  await ensureDir(item?.targetDir);

  try {
    if (item?.extension === PRPLSourceFileExtension.html) {
      await interpolateHTML({ srcTree: item, options: { buildId } });
    } else {
      await copyFile(item?.path, item?.targetFilePath);
    }

    ws?.send(item?.srcRelativeFilePath === '/index.html' ? '/' : item?.srcRelativeFilePath);

    log.info(`${event === 'change' ? 'Updated' : 'Created'} ${item?.srcRelativeFilePath}`);
  } catch (error) {
    log.error(
      `Server failed to ${event === 'change' ? 'update' : 'create'} '${
        item?.srcRelativeFilePath
      }'. Error:`,
      error?.message
    );
  }
}

/**
 * Remove a file from dist.
 */
async function removeFile(removedFilePath: string) {
  const item: PRPLFileSystemTree = await generateFileSystemTree({
    entityPath: removedFilePath
  });

  try {
    if (item?.targetFilePath && (await exists(item?.targetFilePath))) {
      await rm(item?.targetFilePath);
      log.info(`Removed ${item?.srcRelativeFilePath}`);
    }
  } catch (error) {
    log.error(`Server failed to remove ${item?.srcRelativeFilePath}`);
  }
}

export { server };
