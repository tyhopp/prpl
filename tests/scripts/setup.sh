sites=(core plugins server)

for site in ${sites[@]}; do
  cd sites/$site
  npm i
  cd ../..
done