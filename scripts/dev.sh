# Develop packages.

# Example usage:

#   `npm run dev core`
#   `npm run dev core server`

pkgs=$@
comma_separated_pkgs=${pkgs// /,}

npx rollup -w -c rollup.config.js --scope=$comma_separated_pkgs
