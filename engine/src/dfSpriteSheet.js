var dfSpriteSheet = function () {
    this.texture = null;
    this.spriteFrames = {};
}

dfSpriteSheet.prototype.load = function (spritesheetFile, cb) {
    var self = this;
    cc.loader.loadTxt(spritesheetFile, function (err, txt) {
        if (err) {
            cc.error(err);
        } else if (txt) {
            self.init(fastxmlparser.parse(txt, {
                attrPrefix: "",
                ignoreNonTextNodeAttr: false,
                ignoreTextNodeAttr: false,
                ignoreNameSpace: false
            }), function () {
                cb && cb(self);
            });
        }
    });
}

dfSpriteSheet.prototype.init = function (sheetData, cb) {
    var img = sheetData.img;
    if (img) {
        this.texture = cc.textureCache.addImage(getResourceAlias(img.name));

        var definitions = img.definitions;
        if (definitions) {
            this.addSpriteFrame("", definitions.dir);
        }
    }

    cb && cb();
}

dfSpriteSheet.prototype.addSpriteFrame = function (dirPath, root) {
    var dir = root.dir;
    if (root.spr) {
        var spr = Array.isArray(root.spr) ? root.spr : [root.spr];
        for (var i = 0; i < spr.length; ++i) {
            var s = spr[i];

            var path = dirPath + "/" + s.name;
            var frame = new cc.SpriteFrame(this.texture, cc.rect(parseInt(s.x), parseInt(s.y), parseInt(s.w), parseInt(s.h)));
            frame.retain();
            this.spriteFrames[path] = frame;
        }
    }

    if (root.dir) {
        var dir = Array.isArray(root.dir) ? root.dir : [root.dir];
        for (var i = 0; i < dir.length; ++i) {
            var d = dir[i];
            this.addSpriteFrame(dirPath + "/" + d.name, d);
        }
    }
}

dfSpriteSheet.prototype.unload = function () {    
    if (this.texture) {        
        for (var k in this.spriteFrames) {
            this.spriteFrames[k].release();
        }

        cc.textureCache.removeTexture(this.texture);

        this.texture = null;
        this.spriteFrames = null;
    }
}

dfSpriteSheet.prototype.getSpriteFrame = function (path) {
    return this.spriteFrames[path];
}

if (!cc.sys.isNative) {
    cc.SpriteFrame.prototype.retain = function () {
    }

    cc.SpriteFrame.prototype.release = function () {
    }
}