#/bin/bash
source ./config.sh

echo Make for web
./makeGame.sh release

cd ../engine
cocos compile -p web -m release
cd ../scripts

rsync -ar --progress ../engine/publish/html5 $REMOTE:/home/goldfish/
rsync -ar --progress ../engine/_dist/ $REMOTE:/home/goldfish/html5/content/
