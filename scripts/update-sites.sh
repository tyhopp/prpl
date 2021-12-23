# Docs site --------------------------------------------------

# Update docs site
cd docs
npm i @prpl/core@latest @prpl/plugin-code-highlight@latest @prpl/plugin-css-imports@latest @prpl/plugin-html-imports@latest @prpl/plugin-sitemap@latest && npm i -D @prpl/server@latest
cd ..
git add .
git commit -m "docs: Update PRPL deps"

# Example sites --------------------------------------------------

examples=("basic" "esm" "commonjs")

for example in ${examples[@]}; do
  cd "examples/${example}"
  npm i @prpl/core@latest @prpl/server@latest
  cd ../..
done

git add .
git commit -m "chore(examples): Update PRPL deps"