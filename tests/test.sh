set -e # Exit on error, see https://www.gnu.org/savannah-checkouts/gnu/bash/manual/bash.html#The-Set-Builtin

mode=$1
sites=(core plugins)
extensions=(mjs)

if [ "$mode" = "build" ]
then
  for site in ${sites[@]}; do
    cd sites/$site

    for ext in ${extensions[@]}; do
      rm -rf dist
      node scripts/build.$ext
      cd ../..
      uvu tests/$site --bail
      cd sites/$site
    done
    
    cd ../..
  done
fi

if [ "$mode" = "server" ]
then
  cd sites/server

  for ext in ${extensions[@]}; do
    rm -rf dist
    node scripts/build.$ext
    node scripts/serve.$ext &
    sleep 1
    cd ../..
    uvu tests/server --bail
    sleep 1
    kill "%node scripts/serve"
    cd sites/server
  done
  
  cd ../..
fi