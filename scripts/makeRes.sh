#!/bin/bash
source ./config.sh

export CREATOR_PACK="node ../tools/creatorpack-src/index.js"
export SPRITE_PACK="node ../tools/spritepack-src/index.js"
export FILE_HASH="node ../tools/filehash-src/index.js"

echo Packing sprites...

mkdir -p $OUTDIR

$SPRITE_PACK --maxSheetSize=2048 --outdir ../engine/res ../resources/bootstrap
$SPRITE_PACK --outdir $OUTDIR ../resources/splash
$SPRITE_PACK --outdir $OUTDIR ../resources/battle
$SPRITE_PACK --outdir $OUTDIR ../resources/pokemons
$SPRITE_PACK --outdir $OUTDIR ../resources/buildings
$SPRITE_PACK --outdir $OUTDIR ../resources/effects
$SPRITE_PACK --outdir $OUTDIR ../resources/ui

cp -f ../resources/sound/* $OUTDIR/

$FILE_HASH $OUTDIR $OUTDIR/hash.json
