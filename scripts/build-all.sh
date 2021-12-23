npm run clear

for dir in packages/*; do
  package=${dir#'packages/'}
  rollup -c rollup-package.config.js --scope @prpl/$package || exit 1
done

npx rollup -c rollup-client.config.js