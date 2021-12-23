npm run clear

lerna changed | while read package; do
  npx rollup -c rollup-package.config.js --scope $package || exit 1

  if [[ "$package" = "@prpl/core" ]]; then
    npx rollup -c rollup-client.config.js
  fi
done