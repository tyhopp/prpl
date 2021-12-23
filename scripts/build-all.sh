npm run clear

for dir in packages/*; do
  package=${dir#'packages/'}

  case $package in
    create-prpl)
      rollup -c rollup-package.config.js --scope $package || exit 1
      ;;

    *)
      rollup -c rollup-package.config.js --scope @prpl/$package || exit 1
      ;;
  esac
done

npx rollup -c rollup-client.config.js