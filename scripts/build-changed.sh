npm run clear

lerna changed | while read package; do
  npx rollup -c rollup-package.config.js --scope $package || exit 1
done

npx rollup -c rollup-client.config.js