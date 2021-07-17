import { resolve } from 'path';
import typescript from 'rollup-plugin-typescript2';

const clientScripts = [
  resolve('packages/core/src/client/prefetch-worker.ts'),
  resolve('packages/core/src/client/prefetch.ts'),
  resolve('packages/core/src/client/router.ts'),
  resolve('packages/server/src/socket.ts')
];

/**
 * Bundle client scripts.
 */
async function bundle() {
  const config = [];

  for (const clientScript of clientScripts) {
    config.push({
      input: clientScript,
      output: [
        {
          file: clientScript.replace('src', 'dist').replace('ts', 'js'),
          format: 'es'
        }
      ],
      plugins: [
        typescript({
          tsconfigOverride: {
            compilerOptions: {
              declaration: false
            }
          }
        })
      ]
    });
  }

  return config;
}

export default bundle;
