# Bump all package versions.
# See https://docs.npmjs.com/cli/v8/commands/npm-version#synopsis

bump=$1 # e.g. major, minor, patch

for pkg in packages/*; do
    cd $pkg
    npm version $bump
    cd ../..
done