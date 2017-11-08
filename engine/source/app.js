// @flow
if (!window) {
    window = {};
}

window.SplashScene = require('./SplashScene');

window.initApp = function() {
    console.log('init app...');

    // Injections
    if (!cc.sys.isNative) {
        sp._atlasLoader = {
            spAtlasFile:null,
            setAtlasFile:function(spAtlasFile){
                this.spAtlasFile = spAtlasFile;
            },
            load:function(line){

                // NTChung hacks
                //var texturePath = cc.path.join(cc.path.dirname(this.spAtlasFile), line);
                var texturePath = getResourceAlias(line);

                var texture = cc.textureCache.addImage(texturePath);
                var tex = new sp.SkeletonTexture();
                tex._image = { width: texture.getPixelsWide(), height: texture.getPixelsHigh() };
                tex.setRealTexture(texture);
                return tex;
            },
            unload:function(obj){
            }
        };
    }
}
