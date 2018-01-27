#/bin/bash
source ./config.sh

export FILE_HASH="node ../tools/filehash-src/index.js"

echo Make source only

cd ../engine

if [ "$1" = "release" ]; then
export NODE_ENV=production
#../node_modules/.bin/webpack -p
else
#../node_modules/.bin/webpack
fi

cd ../scripts

$FILE_HASH $OUTDIR $OUTDIR/hash.json
