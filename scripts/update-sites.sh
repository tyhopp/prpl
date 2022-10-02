# Update package.json and package-lock.json files with latest PRPL deps.
# Some workspace commands (e.g. install, update) are borked, so we have to do this manually.

core_latest=$(npm view "@prpl/core" version)
server_latest=$(npm view "@prpl/server" version)

# Update example site deps
npm pkg set "dependencies[@prpl/core]"="^${core_latest}" --workspace=examples
npm pkg set "devDependencies[@prpl/server]"="^${server_latest}" --workspace=examples

# Update docs deps
npm pkg set "dependencies[@prpl/core]"="^${core_latest}" --workspace=docs
npm pkg set "devDependencies[@prpl/server]"="^${server_latest}" --workspace=docs

plugins=("core" "plugin-code-highlight" "plugin-css-imports" "plugin-html-imports" "plugin-sitemap")

for plugin in ${plugins[@]}; do
  latest=$(npm view "@prpl/${plugin}" version)
  npm pkg set "dependencies[@prpl/${plugin}]"="^${latest}" --workspace=docs
done

# Recreate lockfiles, workspaces + lockfiles are broken in npm
examples=("examples/basic" "examples/commonjs" "examples/deno" "examples/esm")

# Recreate example lockfiles
for example in ${examples[@]}; do
  cd $example
  rm package-lock.json
  npm install --workspaces=false
  cd ../..
done

# Recreate docs lockfile
cd docs
rm package-lock.json
npm install --workspaces=false
cd ../

# Show if tree is borked or not
npm ls