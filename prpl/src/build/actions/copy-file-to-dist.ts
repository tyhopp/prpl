import { copyFileSync } from 'fs';
import { ensureDirExists } from './ensure-dir-exists';

function copyFileToDist(item) {
  const { path, name } = item || {};
  const dir = path?.replace(name, '')?.replace('src', 'dist');
  ensureDirExists(dir);
  copyFileSync(path, `${dir}/${name}`);
};

export {
  copyFileToDist
};
