if (!cc.sys.isNative) {
    var facebook = facebook || {};

    facebook.isInitialized = function() {
        return true;
    }

    facebook.getLoginStatus = function(cb) {
        FB.getLoginStatus(cb);
    }

    facebook.login = function(cb, params) {
        FB.login(cb, params);
    }    
    
    facebook.logout = function(cb) {
        FB.logout(cb);
    }

    facebook.update = function() {        
    }

    facebook.openGameRequestDialog = function(message, cb) {
        FB.ui({
            method: 'apprequests',
            message: message
        }, function(response){            
            cb && cb(response);
        });
    }

    facebook.api = function(path, method, params, cb) {
        FB.api(path, method, params, cb)
    }
}
