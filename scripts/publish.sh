# Publish packages.

# Example usage:

#  - `npm run publish`
#  - `npm run publish --dry-run`
#  - `npm run publish core server`
#  - `npm run publish --dry-run core server`

# Does not automatically bump versions or write changelogs, do
# this prior to running this script.

pkgs=$@
run_state=""

if [ "$1" == "--dry-run" ]; then
   pkgs="${pkgs/--dry-run /}"
   run_state="--dry-run"
fi

if [ $# -eq 0 ]; then
   for pkg in packages/*; do
      npm publish $run_state --workspace $pkg
   done
   exit 0
fi

for pkg in $pkgs; do
   npm publish $run_state --workspace "packages/${pkg}"
done
