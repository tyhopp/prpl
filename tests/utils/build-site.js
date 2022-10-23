import { resolve, join, sep } from 'path';
import { execSync } from 'child_process';
import rimraf from 'rimraf';

// TODO: Pass in build script, for now use ESM script
async function buildSite(site) {
  const siteDir = resolve(process.cwd(), 'fixtures', site);
  rimraf.sync(join(siteDir, 'dist'));
  const script = join('scripts', 'build.mjs');
  execSync(`node ${script}`, { stdio: 'inherit', cwd: siteDir });
}

export { buildSite };
