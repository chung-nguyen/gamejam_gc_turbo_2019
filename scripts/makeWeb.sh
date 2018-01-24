#/bin/bash
source ./config.sh

echo Make for web
./makeGame.sh release

cd ../engine
cocos compile -p web -m release
cd ../scripts

rsync -ar --progress ../engine/publish/html5 $REMOTE:$REMOTE_DIR
rsync -ar --progress ../engine/_dist/ $REMOTE:$REMOTE_DIR/html5/content/
