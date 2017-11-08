#/bin/bash
source ./config.sh

./makeGame.sh release

cd ../engine
cocos compile -p android --android-studio -m release -j2
cd ../scripts

./upload.sh

