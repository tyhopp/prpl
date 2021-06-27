#!/usr/bin/env node

import { interpolate } from '../dist/interpolate/interpolate.js';
import { server } from '../dist/server/server.js';
import { clearDist } from '../dist/lib/clear-dist.js';
import { log } from '../dist/lib/log.js';

const commands = {
  build: true,
  serve: true,
  clear: true
};

const command = process.argv.reduce((selectedArg, arg) => {
  if (arg in commands) {
    selectedArg = arg;
  }
  return selectedArg;
}, '');

switch (command) {
  case 'build':
    await clearDist();
    await interpolate();
    break;
  case 'serve':
    await clearDist();
    await interpolate();
    await server();
    break;
  case 'clear':
    await clearDist();
    break;
  default:
    log.error(
      'Invalid command. Valid commands are:',
      Object.keys(commands).join(', ')
    );
}
