source ./config.sh

echo Uploading to server...
ssh $REMOTE "mkdir -p $REMOTE_DIR/server"
rsync -ar --progress $SRC_SERVER_DIR/* $REMOTE:$REMOTE_DIR/server

ssh $REMOTE pm2 start $REMOTE_DIR/server/pm2.json
