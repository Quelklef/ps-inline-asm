set -euo pipefail
[ -e outex ] && rm -rf outex
cp -r example outex
node ./ps-inline-asm.js ./outex/*.purs
