if (!cc.sys.isNative) {
    var analytics = analytics || {};

    analytics.serUserId = function(userId) {
        return true;
    }

    analytics.serUserProperty = function(key, value) {
        return true;
    }

    analytics.setCurrentScreen = function(name, className) {
        return true;
    }

    analytics.logEvent = function(name, params) {
        return true;
    }
}
