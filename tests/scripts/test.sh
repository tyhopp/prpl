mode=$1 # build or server
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
      uvu tests/$site
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
    uvu tests/server
    sleep 1
    killall node
    cd sites/server
  done
  
  cd ../..
fi