const path = require('path');
const { execSync } = require('child_process');
const fs = require('fs');

const starter = 'https://github.com/tyhopp/prpl-starter-minimal.git';
const repoPath = path.resolve('prpl-starter-minimal');

// Clone basic starter
execSync(`git clone ${starter} --depth 1 --single-branch --quiet`, {
  stdio: [0, 1, 2],
  cwd: path.resolve('')
});

// Remove git repo from cloned starter
fs.rmdirSync(path.resolve(repoPath, '.git'), { recursive: true });

// Install dependency
execSync('npm', {
  stdio: [0, 1, 2],
  cwd: repoPath
});

// Run project
execSync('npm run start', {
  stdio: [0, 1, 2],
  cwd: repoPath
});
