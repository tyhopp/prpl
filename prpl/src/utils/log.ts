class Log {
  debug(...args): void {
    console.debug('\x1b[35m', '[PRPL]', ...args, '\x1b[0m');
  }

  info(...args): void {
    console.info('\x1b[35m', '[PRPL]', ...args, '\x1b[0m');
  }

  warning(...args): void {
    console.warn('\x1b[35m', '[PRPL]', ...args, '\x1b[0m');
  }

  error(...args): void {
    console.error('\x1b[35m', '[PRPL]', ...args, '\x1b[0m');
  }

  critical(...args): void {
    console.error('\x1b[35m', '[PRPL]', ...args, '\x1b[0m');
  }
}

const log = new Log();

export { log };
