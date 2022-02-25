sites=(core plugins server)
extensions=(cjs mjs)

for site in ${sites[@]}; do
  cd sites/$site

  for ext in ${extensions[@]}; do
    rm -rf dist
    node scripts/build.$ext
    cd ../..
    uvu tests/${site}
    cd sites/$site
  done
  
  cd ../..
done