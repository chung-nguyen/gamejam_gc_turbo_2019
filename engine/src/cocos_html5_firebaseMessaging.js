if (!cc.sys.isNative) {
    var firebaseMessaging = firebaseMessaging || {};

    firebaseMessaging.getToken = function() {
        return "";
    }

    firebaseMessaging.subscribe = function(topic) {        
    }

    firebaseMessaging.unsubscribe = function(topic) {        
    }

    firebaseMessaging.popNotification = function() {        
        return null;
    }

    firebaseMessaging.setGameShowingNotification = function(value) {        
    }
}
