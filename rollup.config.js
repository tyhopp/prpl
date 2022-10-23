import { EOL } from 'os';
import { resolve } from 'path';
import { readdir, readFile } from 'fs/promises';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';

async function bundle(args) {
  const watchPackages = args?.input
  delete args?.input;

  const packageConfigs = await createPackageConfigs(watchPackages);
  const clientFileConfigs = await createClientFileConfigs(watchPackages);

  return [...packageConfigs, ...clientFileConfigs];
}

async function getKnownPackages() {
  const entriesInDir = await readdir(resolve('packages'), { withFileTypes: true });

  const knownRegularPackages = entriesInDir.reduce((packages, entry) => {
    if (entry.isDirectory()) {
      packages[entry.name] = true;
    }
    return packages;
  }, {});

  return knownRegularPackages;
}

async function getPackageDependencies(knownRegularPackages) {
  const knownRegularPackageDeps = ['@prpl', 'fs/promises', 'path', 'http', 'child_process'];

  for (const regularPackage of Object.keys(knownRegularPackages)) {
    const packageJsonString = (
      await readFile(resolve(`packages/${regularPackage}/package.json`))
    )?.toString();
    const { dependencies = [] } = JSON.parse(packageJsonString);
    const depKeys = Object.keys(dependencies);
    knownRegularPackageDeps.push(...depKeys);
  }

  return knownRegularPackageDeps;
}

async function createPackageConfigs(watchPackages = []) {
  const regularPackages = [];
  const packageConfigs = [];

  const knownRegularPackages = await getKnownPackages();
  const packageDependencies = await getPackageDependencies(knownRegularPackages);

  if (watchPackages.length) {
    for (const watchPackage of watchPackages) {
      if (!knownRegularPackages[watchPackage]) {
        throw new Error(`[PRPL] Unknown package passed to watch: ${watchPackage}`);
      }
      regularPackages.push(watchPackage);
    }
  }

  if (!regularPackages.length) {
    regularPackages.push(...Object.keys(knownRegularPackages));
  }

  for (const regularPackage of regularPackages) {
    const banner = regularPackage === 'create-prpl' ? `#!/usr/bin/env node${EOL}` : '';

    packageConfigs.push({
      input: resolve(`packages/${regularPackage}/src/index.ts`),
      output: [
        {
          name: regularPackage,
          format: 'cjs',
          sourcemap: false,
          dir: resolve(`packages/${regularPackage}/dist`),
          entryFileNames: '[name].cjs',
          banner
        },
        {
          name: regularPackage,
          format: 'es',
          sourcemap: false,
          dir: resolve(`packages/${regularPackage}/dist`),
          entryFileNames: '[name].mjs',
          banner
        }
      ],
      external: (id) => packageDependencies.some((dep) => id.includes(dep)),
      plugins: [
        nodeResolve(),
        commonjs(),
        typescript({
          tsconfigOverride: {
            include: [`packages/${regularPackage}/**/*`]
          }
        })
      ]
    });
  }

  return packageConfigs;
}

async function createClientFileConfigs(watchPackages = []) {
  const clientFiles = [];
  const clientFileConfigs = [];

  const coreClientFiles = [
    resolve('packages/core/src/client/prefetch-worker.ts'),
    resolve('packages/core/src/client/prefetch.ts'),
    resolve('packages/core/src/client/router.ts')
  ];

  const serverClientFiles = [resolve('packages/server/src/socket.ts')];

  for (const watchPackage of watchPackages) {
    switch (watchPackage) {
      case 'core':
        clientFiles.push(...coreClientFiles);
        break;
      case 'server':
        clientFiles.push(...serverClientFiles);
        break;
    }
  }

  if (!clientFiles.length) {
    clientFiles.push(...coreClientFiles, ...serverClientFiles);
  }

  for (const file of clientFiles) {
    clientFileConfigs.push({
      input: file,
      output: [
        {
          file: file.replace('src', 'dist').replace('ts', 'js'),
          format: 'es'
        }
      ],
      plugins: [
        typescript({
          tsconfigOverride: {
            include: clientFiles,
            compilerOptions: {
              declaration: false
            }
          }
        })
      ]
    });
  }

  return clientFileConfigs;
}

export default bundle;
