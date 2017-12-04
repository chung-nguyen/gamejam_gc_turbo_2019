#!/bin/bash
source ./config.sh

export CREATOR_PACK="node ../tools/creatorpack-src/index.js"
export SPRITE_PACK="node ../tools/spritepack-src/index.js"
export FILE_HASH="node ../tools/filehash-src/index.js"

echo Packing sprites...

mkdir -p $OUTDIR

$SPRITE_PACK --keepMargin=1 --maxSheetSize=2048 --outdir ../engine/res ../resources/bootstrap
$SPRITE_PACK --keepMargin=1 --outdir $OUTDIR ../resources/splash
$SPRITE_PACK --outdir $OUTDIR ../resources/fishes
$SPRITE_PACK --outdir $OUTDIR ../resources/hooks

$FILE_HASH $OUTDIR $OUTDIR/hash.json
