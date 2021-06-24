interface Log {
  debug: (...data: any[]) => void;
  info: (...data: any[]) => void;
  warning: (...data: any[]) => void;
  error: (...data: any[]) => void;
  critical: (...data: any[]) => void;
}

const log: Log = {
  debug(...args) {
    console.debug('\x1b[35m', '[PRPL]', ...args, '\x1b[0m');
  },
  info(...args) {
    console.info('\x1b[35m', '[PRPL]', ...args, '\x1b[0m');
  },
  warning(...args) {
    console.warn('\x1b[35m', '[PRPL]', ...args, '\x1b[0m');
  },
  error(...args) {
    console.error('\x1b[35m', '[PRPL]', ...args, '\x1b[0m');
  },
  critical(...args) {
    console.error('\x1b[35m', '[PRPL]', ...args, '\x1b[0m');
  }
};

export { log };
