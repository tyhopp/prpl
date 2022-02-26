set -e # Exit on error, see https://www.gnu.org/savannah-checkouts/gnu/bash/manual/bash.html#The-Set-Builtin

sites=(core plugins server)

for site in ${sites[@]}; do
  cd sites/$site
  npm i
  cd ../..
done