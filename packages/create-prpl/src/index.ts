import { execSync } from 'child_process';
import path from 'path';
import rimraf from 'rimraf';
import fsExtra from 'fs-extra';

const cwd = path.resolve('');

const repo = 'https://github.com/tyhopp/prpl';
const example = 'basic';

// Exec sync convenience wrapper
function sh(cmd: string, args = {}): void {
  execSync(cmd, {
    stdio: [0, 1, 2],
    cwd,
    ...args
  });
}

// Clone basic starter via sparse checkout, GitHub since Git v2.19
sh(`git clone ${repo} --depth 1 --single-branch --quiet --sparse`);
sh(`git sparse-checkout set examples/${example}`, { cwd: path.resolve('prpl') });

// Collapse and rename example
const originalExamplePath = path.resolve(`prpl/examples/${example}`);
const renamedExample = `prpl-example-${example}`;

// Copy to renamed example
fsExtra.copySync(originalExamplePath, renamedExample);

// Remove original example
rimraf.sync('prpl');

// Remove git history
rimraf.sync(path.join(renamedExample, '.git'));

// Install dependencies
sh('npm install', { cwd: renamedExample });

// Run project
sh('npm run dev', { cwd: renamedExample });
