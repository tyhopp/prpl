import { relative, join } from 'path';
import { getPackages } from '@lerna/project';
import sourcemaps from 'rollup-plugin-sourcemaps';
import typescript from 'rollup-plugin-typescript2';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import autoExternal from 'rollup-plugin-auto-external';
import { filterPackages } from '@lerna/filter-packages';
import minimist from 'minimist';

/**
 * Bundle packages.
 */
async function bundle(cliArgs) {
  // Prevent rollup warning
  delete cliArgs.scope;
  delete cliArgs.ignore;

  const config = [];

  // Bundle packages
  const rawPackages = await getPackages(__dirname);

  // Use package scope so packages are only passed through rollup once
  const { scope, ignore } = minimist(process.argv.slice(2));
  const packages = filterPackages(rawPackages, scope, ignore, false);

  for (const pkg of packages) {
    const basePath = relative(__dirname, pkg.location);
    const input = join(basePath, 'src/index.ts');
    const { name } = pkg.toJSON();

    config.push({
      input,
      output: [
        {
          name,
          format: 'cjs',
          sourcemap: false,
          dir: `${basePath}/dist`,
          entryFileNames: '[name].cjs'
        },
        {
          name,
          format: 'es',
          sourcemap: false,
          dir: `${basePath}/dist`,
          entryFileNames: '[name].mjs'
        }
      ],
      external: ['fs/promises'],
      plugins: [
        autoExternal({
          packagePath: join(basePath, 'package.json')
        }),
        sourcemaps(),
        nodeResolve(),
        commonjs(),
        typescript()
      ]
    });
  }

  return config;
}

export default bundle;
