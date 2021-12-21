# Docs site --------------------------------------------------

# Start from main branch
git checkout main

# Update docs site
cd docs
npm i @prpl/core@latest @prpl/plugin-code-highlight@latest @prpl/plugin-css-imports@latest @prpl/plugin-html-imports@latest @prpl/plugin-sitemap@latest && npm i -D @prpl/server@latest
cd ..
git add .
git commit -m "docs: Update PRPL deps"

# Push commit
git push

# Starters --------------------------------------------------

# Assumes starters exist adjacent to prpl
starters=("minimal" "esm" "commonjs")

for starter in ${starters[@]}; do
  cd "../prpl-starter-${starter}"

  # Start from master branch
  git checkout master

  # Update docs site
  npm i @prpl/core@latest @prpl/server@latest
  git add .
  git commit -m "chore: Update PRPL deps"

  # Push commit
  git push

  cd ../prpl
done