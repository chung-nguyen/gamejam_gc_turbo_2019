if (!cc.sys.isNative) {
    var nativeEngine = nativeEngine || {};

    nativeEngine.requireGame = function(name) {
        return 0;
    }

    nativeEngine.freeGame = function(gameId) {        
    }
}
