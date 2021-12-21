# Develop a package - `npm run dev -- core`
# Develop client scripts - `npm run dev -- client`

pkg=$1

trap cleanup EXIT

function cleanup() {
  if [ "$pkg" = "client" ]
  then
    cd packages/core && npm unlink -g @prpl/core --silent && cd ../..
  else
    cd packages/$pkg && npm unlink -g @prpl/$pkg --silent && cd ../..
  fi

  printf "\n\nGlobally linked modules:\n\n"
  npm ls -g --depth=0 --link=true
}

if [ "$pkg" = "client" ]
then
  cd packages/core && npm link --silent && cd ../..
  npx rollup -w -c rollup-client.config.js
else
  cd packages/$pkg && npm link --silent && cd ../..
  npx rollup -w -c rollup-package.config.js --scope @prpl/$pkg
fi