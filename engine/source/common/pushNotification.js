function update() {
    const notification = firebaseMessaging.popNotification();
    if (notification) {
        const os = notification.os;
        const remoteMessage = notification.data;
        let data = null;
        let content = null;
        
        if (os === 'android') {
            data = remoteMessage;
            content = remoteMessage.notification;
        } else if (os === 'ios') {
            // TODO: parse the ios notification
            // ...
        }     

        // debug
        //this.showError(notification);     
        
        // show popup
        if (content) {                
            // TODO
            // ...
        }

        // handle the data part
        if (data) {
            this.onNotification && this.onNotification(data, content);
        }
    }
}

module.exports = {
    update
};
