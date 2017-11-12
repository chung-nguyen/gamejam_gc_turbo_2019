/**
 * A brief explanation for "project.json":
 * Here is the content of project.json file, this is the global configuration for your game, you can modify it to customize some behavior.
 * The detail of each field is under it.
 {
    "project_type": "javascript",
    // "project_type" indicate the program language of your project, you can ignore this field

    "debugMode"     : 1,
    // "debugMode" possible values :
    //      0 - No message will be printed.
    //      1 - cc.error, cc.assert, cc.warn, cc.log will print in console.
    //      2 - cc.error, cc.assert, cc.warn will print in console.
    //      3 - cc.error, cc.assert will print in console.
    //      4 - cc.error, cc.assert, cc.warn, cc.log will print on canvas, available only on web.
    //      5 - cc.error, cc.assert, cc.warn will print on canvas, available only on web.
    //      6 - cc.error, cc.assert will print on canvas, available only on web.

    "showFPS"       : true,
    // Left bottom corner fps information will show when "showFPS" equals true, otherwise it will be hide.

    "frameRate"     : 60,
    // "frameRate" set the wanted frame rate for your game, but the real fps depends on your game implementation and the running environment.

    "noCache"       : false,
    // "noCache" set whether your resources will be loaded with a timestamp suffix in the url.
    // In this way, your resources will be force updated even if the browser holds a cache of it.
    // It's very useful for mobile browser debugging.

    "id"            : "gameCanvas",
    // "gameCanvas" sets the id of your canvas element on the web page, it's useful only on web.

    "renderMode"    : 0,
    // "renderMode" sets the renderer type, only useful on web :
    //      0 - Automatically chosen by engine
    //      1 - Forced to use canvas renderer
    //      2 - Forced to use WebGL renderer, but this will be ignored on mobile browsers

    "engineDir"     : "frameworks/cocos2d-html5/",
    // In debug mode, if you use the whole engine to develop your game, you should specify its relative path with "engineDir",
    // but if you are using a single engine file, you can ignore it.

    "modules"       : ["cocos2d"],
    // "modules" defines which modules you will need in your game, it's useful only on web,
    // using this can greatly reduce your game's resource size, and the cocos console tool can package your game with only the modules you set.
    // For details about modules definitions, you can refer to "../../frameworks/cocos2d-html5/modulesConfig.json".

    "jsList"        : [
    ]
    // "jsList" sets the list of js files in your game.
 }
 *
 */

 var document = document || { location: { hostname: '/' } };

var engineSettings = {
    isWeb: !cc.sys.isNative,
    isLocalHost: !cc.sys.isNative && document.location.hostname === 'localhost',
    isDevDesktop: cc.sys.isNative && !cc.sys.isMobile,
    isRelease: cc.sys.isNative && cc.sys.isMobile
}

var cdnLocation = 'http://128.199.254.229:9000/content/';
if (engineSettings.isLocalHost) {
    cdnLocation = '_dist/';
} else if (engineSettings.isWeb) {
    cdnLocation = 'content/';
}

var _localResPath = null;

var getLocalResPath = function() {
    if (_localResPath) {
        return _localResPath;
    }

    _localResPath = '';
    if (cc.sys.isNative) {
        _localResPath = jsb.fileUtils.getWritablePath() + 'res';        
    }    

    return _localResPath;
}

var bundleFilePath = getLocalResPath();
if (engineSettings.isLocalHost) {
    bundleFilePath = "_dist";
} else if (engineSettings.isDevDesktop) {
    bundleFilePath = getLocalResPath() + "/../_dist";
} else if (engineSettings.isWeb) {
    bundleFilePath = "content";
}

var _jsBundleHash = '';
var setJSBundleHash = function(hash) {
    _jsBundleHash = hash;
}

var window = window || {};
var WebSocket = WebSocket || window.WebSocket || window.MozWebSocket;

if (!cc.log) {
    cc.log = function (value) {
        console.log && console.log(typeof (value) === 'string' ? value : JSON.stringify(value));
    }
}

if (!cc.error) {
    cc.error = function (value) {
        if (console.error) {
            console.error(typeof (value) === 'string' ? value : JSON.stringify(value));   
        } else {
            cc.log(typeof (value) === 'string' ? value : JSON.stringify(value));   
        }        
    }
}

function downloadBundleJs(cb) {        
    // download the bundle js file from local dev server
    if (engineSettings.isDevDesktop) {
        var url = "http://localhost:8080/_dist/bundle.js";
        var saveTo = bundleFilePath + '/bundle.js';
        jsb.saveRemoteFile(url, saveTo, function(downloadedSize) {        
            cb && cb();        
        }); 
    } else {
       cb && cb();
    }
}

cc.game.onStart = function(){
    var sys = cc.sys;
    if(!sys.isNative && document.getElementById("cocosLoading")) //If referenced loading.js, please remove it
        document.body.removeChild(document.getElementById("cocosLoading"));

    // Pass true to enable retina display, on Android disabled by default to improve performance
    cc.view.enableRetina(sys.os === sys.OS_IOS ? true : false);

    // Disable auto full screen on baidu and wechat, you might also want to eliminate sys.BROWSER_TYPE_MOBILE_QQ
    if (sys.isMobile && 
        sys.browserType !== sys.BROWSER_TYPE_BAIDU &&
        sys.browserType !== sys.BROWSER_TYPE_WECHAT) {
        cc.view.enableAutoFullScreen(true);
    }

    // Adjust viewport meta
    cc.view.adjustViewPort(true);

    // Uncomment the following line to set a fixed orientation for your game
    // cc.view.setOrientation(cc.ORIENTATION_PORTRAIT);

    // Setup the resolution policy and design resolution size
    if (cc.sys.isNative) {
        cc.view.setDesignResolutionSize(1920, 1080, cc.ResolutionPolicy.NO_BORDER);
    } else {
        cc.view.setDesignResolutionSize(1920, 1080, cc.ResolutionPolicy.SHOW_ALL);
    }

    // The game will be resized when browser size change
    cc.view._orientationChanging = false; // hot fix
    cc.view.resizeWithBrowserSize(true);

    cc.log('is running on native? ' + cc.sys.isNative);
    cc.log('cdn location ' + cdnLocation);

    var resToLoad = [
        bootstrapResources.bootstrapUI_plist,
        bootstrapResources.bootstrapUI_png
    ];  

    // Preload default resources
    cc.loader.load(resToLoad, function() {}, function() {
        // Override cdn url if necessary
        var writablePath = cc.sys.isNative ? jsb.fileUtils.getWritablePath() : '';

        cc.log('Downloading to: ' + writablePath);
        if (cc.sys.isNative) {
            cc.loader.loadTxt(writablePath + 'cdnLocation.txt', function (err, txt) {
                if (!err && txt && txt.length > 0) {
                    cdnLocation = txt;
                }

                bootstrap(cdnLocation, function() {  
                    downloadBundleJs(function() {
                        cc.loader.loadJs(bundleFilePath, ["bundle.js"], function () {
                            // Run the game
                            window.initApp();
                            cc.director.runScene(new window.SplashScene());        
                        });
                    });
                });
            });
        } else {
            bootstrap(cdnLocation, function() {
                var bundleFileName = "bundle.js?_v=" + _jsBundleHash;
                if (document.location.hostname === 'localhost') {
                    bundleFileName = "bundle.js";
                }

                cc.log('loading bundle: ' + bundleFileName);
                cc.loader.loadJs(bundleFilePath, [bundleFileName], function (err) {
                    // Run the game
                    window.initApp();
                    cc.director.runScene(new window.SplashScene());        
                });
            });
        }        
    });
};
cc.game.run();