import { execSync } from 'child_process';
import path from 'path';

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
sh(`git clone ${repo} -b chore-examples --depth 1 --single-branch --quiet --sparse`);
sh(`git sparse-checkout set examples/${example}`, { cwd: path.resolve('prpl') });

// Collapse and rename example
const originalExamplePath = path.resolve(`prpl/examples/${example}`);
const renamedExample = `prpl-example-${example}`;

// Move example
sh(`mv ${originalExamplePath} ${renamedExample}`);

// Remove prpl
sh(`rm -rf prpl`);

// Remove git history
sh('rm -rf .git', { cwd: renamedExample });

// Install dependencies
sh('npm install', { cwd: renamedExample });

// Run project
sh('npm run dev', { cwd: renamedExample });
