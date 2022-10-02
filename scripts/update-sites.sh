# Docs site --------------------------------------------------

# Update docs site
cd docs
npm i --workspaces=false @prpl/core@latest @prpl/plugin-code-highlight@latest @prpl/plugin-css-imports@latest @prpl/plugin-html-imports@latest @prpl/plugin-sitemap@latest && npm i --workspaces=false -D @prpl/server@latest
cd ..
git add .
git commit -m "chore(docs): Update PRPL deps"

# Example sites --------------------------------------------------

examples=("basic" "esm" "commonjs" "deno")

for example in ${examples[@]}; do
  cd "examples/${example}"
  npm i --workspaces=false @prpl/core@latest @prpl/server@latest
  cd ../..
done

git add .
git commit -m "chore(examples): Update PRPL deps"