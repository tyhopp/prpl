# Publish packages. Examples:
#  - `npm run publish`
#  - `npm run publish --dry-run`
#  - `npm run publish core server`
#  - `npm run publish --dry-run core server`
# Does not bump versions automatically, do this yourself manually.

pkgs=$@
run_state=""

if [ $1 = "--dry-run" ]; then
   pkgs="${pkgs/--dry-run /}"
   run_state="--dry-run"
fi

if [ $# -eq 0 ]; then
   npm publish $run_state --workspaces
   exit 0
fi

for pkg in $pkgs; do
   npm publish $run_state --workspace "packages/${pkg}"
done
