#!/usr/bin/env node

import { interpolate } from '../dist/interpolate/interpolate.js';
// import { serve } from '../dist/server/server.js';
import { clearDist } from '../dist/lib/clear-dist.js';

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
    // await serve();
    break;
  case 'clear':
    await clearDist();
    break;
  default:
    console.error(
      '\x1b[35m',
      '[PRPL] Invalid command. Valid commands are:',
      Object.keys(commands).join(', '),
      '\x1b[0m'
    );
}
