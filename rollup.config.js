import { relative, join } from 'path';
import { getPackages } from '@lerna/project';
import sourcemaps from 'rollup-plugin-sourcemaps';
import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import autoExternal from 'rollup-plugin-auto-external';
import { filterPackages } from '@lerna/filter-packages';
import minimist from 'minimist';

async function build(commandLineArgs) {
  const config = [];

  const rawPackages = await getPackages(__dirname);

  // Use package scope so packages are only passed through rollup once
  const { scope, ignore } = minimist(process.argv.slice(2));
  const packages = filterPackages(rawPackages, scope, ignore, false);

  // Prevent rollup warning
  delete commandLineArgs.scope;
  delete commandLineArgs.ignore;

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

export default build;
