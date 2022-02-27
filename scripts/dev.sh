# Develop a package - e.g. `npm run dev -- core server plugin-rss`

pkgs=$@
comma_separated_pkgs=${pkgs// /,}

trap cleanup EXIT

function cleanup() {
  for pkg in $pkgs
  do  
    cd packages/$pkg && npm unlink -g @prpl/$pkg --silent && cd ../..
  done
  printf "\n\nGlobally linked modules:\n\n"
  npm ls -g --depth=0 --link=true
}

for pkg in $pkgs
do  
  cd packages/$pkg && npm link --silent && cd ../..
done

npx rollup -w -c rollup.config.js --scope=$comma_separated_pkgs
