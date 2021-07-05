import { relative, join } from 'path';
import { getPackages } from '@lerna/project';
import filterPackages from '@lerna/filter-packages';
import batchPackages from '@lerna/batch-packages';
import sourcemaps from 'rollup-plugin-sourcemaps';
import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import sizes from '@atomico/rollup-plugin-sizes';
import autoExternal from 'rollup-plugin-auto-external';

async function getSortedPackages(scope, ignore) {
  const packages = await getPackages(__dirname);
  const filtered = filterPackages(packages, scope, ignore, false);

  return batchPackages(filtered).reduce((arr, batch) => arr.concat(batch), []);
}

async function build(commandLineArgs) {
  const config = [];
  const packages = await getSortedPackages();

  // Prevent rollup warning
  delete commandLineArgs.ci;
  delete commandLineArgs.scope;
  delete commandLineArgs.ignore;

  packages.forEach((pkg) => {
    const basePath = relative(__dirname, pkg.location);
    const input = join(basePath, 'src/index.ts');
    const { name, main, umd, module } = pkg.toJSON();

    const basePlugins = [sourcemaps(), resolve(), commonjs(), sizes()];

    config.push({
      // perf: true,
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
        ...basePlugins,
        typescript({
          tsconfigOverride: {
            compilerOptions: {
              declaration: true,
              paths: {
                '@prpl/*': ['packages/*/src']
              }
            },
            include: null
          }
        })
      ]
    });
  });

  return config;
}

export default build;
