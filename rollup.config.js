import { resolve as resolvePath, relative, join } from 'path';
import { getPackages } from '@lerna/project';
import sourcemaps from 'rollup-plugin-sourcemaps';
import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import autoExternal from 'rollup-plugin-auto-external';
import { filterPackages } from '@lerna/filter-packages';
import minimist from 'minimist';

const clientScripts = [
  resolvePath('packages/core/src/client/prefetch-worker.ts'),
  resolvePath('packages/core/src/client/prefetch.ts'),
  resolvePath('packages/core/src/client/router.ts')
];

async function bundle(cliArgs) {
  // Prevent rollup warning
  delete cliArgs.scope;
  delete cliArgs.ignore;

  const config = [];

  // Bundle client scripts
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

  // Bundle packages
  const rawPackages = await getPackages(__dirname);

  // Use package scope so packages are only passed through rollup once
  const { scope, ignore } = minimist(process.argv.slice(2));
  const packages = filterPackages(rawPackages, scope, ignore, false);

  for (const pkg of packages) {
    const basePath = relative(__dirname, pkg.location);
    const input = join(basePath, 'src/index.ts');
    const { name, main, umd, module } = pkg.toJSON();

    config.push({
      input,
      output: [
        {
          name,
          file: join(basePath, umd),
          format: 'umd',
          sourcemap: true
        },
        {
          name,
          file: join(basePath, main),
          format: 'cjs',
          sourcemap: true,
          exports: 'auto'
        },
        {
          name,
          file: join(basePath, module),
          format: 'es',
          sourcemap: true
        }
      ],
      plugins: [
        autoExternal({
          packagePath: join(basePath, 'package.json')
        }),
        sourcemaps(),
        resolve(),
        commonjs(),
        typescript()
      ]
    });
  }

  return config;
}

export default bundle;
