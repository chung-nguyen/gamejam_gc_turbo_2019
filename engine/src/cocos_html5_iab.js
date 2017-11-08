if (!cc.sys.isNative) {
    var iab = iab || {};

    iab.launchPurchaseFlow = function(sku, requestCode, payload) {        
    }

    iab.launchSubscriptionPurchaseFlow = function(sku, requestCode, payload) {        
    }

    iab.subscriptionsSupported = function() {
        return false;
    }

    iab.consume = function(jsonData) {

    }

    iab.getPurchase = function() {
        return null;
    }

    iab.popPurchase = function() {        
    }
}
