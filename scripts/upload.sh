source ./config.sh

echo Uploading to server...
ssh $REMOTE "mkdir -p $REMOTE_DIR"
rsync -ar --progress $OUTDIR/* $REMOTE:$REMOTE_DIR
