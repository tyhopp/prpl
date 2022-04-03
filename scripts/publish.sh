# Publish packages.

# Example usage:

#  - `npm run publish [OTP]`
#  - `npm run publish dry-run`
#  - `npm run publish [OTP] core server`
#  - `npm run publish dry-run core server`

# Does not automatically bump versions or write changelogs, do this prior to running this script.

pkgs=$@
run_state=""
otp=""

if [ $# -eq 0 ]; then
   echo "Publish command should have either 'dry-run' or an OTP as a first positional argument, exiting."
   exit 0
fi

if [ "$1" == "dry-run" ]; then
   pkgs="${pkgs/"$1"/}"
   run_state="--$1"
else
   pkgs="${pkgs/"$1"/}"
   otp="--otp=$1"
fi

if [ "$pkgs" == "" ]; then
   for pkg in packages/*; do
      npm publish $run_state $otp --workspace=$pkg
   done
   exit 0
fi

for pkg in $pkgs; do
   npm publish $run_state $otp --workspace "packages/${pkg}"
done
