var dfSpriteAnimation = function () {
    this.spriteSheet = null;
    this.clips = {};
}

dfSpriteAnimation.prototype.load = function (animationFile, cb) {
    var self = this;
    cc.loader.loadTxt(animationFile, function (err, txt) {
        if (err) {
            cc.error(err);
        } else {
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

dfSpriteAnimation.prototype.init = function (animationData, cb) {
    var self = this;

    var animations = animationData.animations;
    this.spriteSheet = new dfSpriteSheet();
    this.spriteSheet.load(getResourceAlias(animations.spriteSheet), function () {
        var anim = Array.isArray(animations.anim) ? animations.anim : [animations.anim];
        for (var i = 0; i < anim.length; ++i) {
            var a = anim[i];
            self.clips[a.name] = self.initClip(a.name, a);
        }

        cb && cb();
    });
}

dfSpriteAnimation.prototype.initClip = function (name, anim) {
    var clip = { 
        name: name,
        loops: anim.loops,
        frames: [],
        totalTime: 0
    };

    var cell = Array.isArray(anim.cell) ? anim.cell : [anim.cell];
    cell.forEach(function (c) {
        c.index = parseInt(c.index);
        c.delay = parseInt(c.delay);
    });

    cell.sort(function (a, b) {
        return a.index - b.index;
    });

    var indexing = 0;
    var currentTime = 0;
    for (var i = 0; i < cell.length; ++i) {
        var c = cell[i];
                
        var frameCells = [];
        var frameCellsMap = {};
        var spr = Array.isArray(c.spr) ? c.spr : [c.spr];
        var count = spr.length;
        var maxZ = count * count;
        for (var j = 0; j < count; ++j) {
            var s = spr[j];

            var id = s.id;
            if (!id) {
                id = s.name + ":" + indexing.toString();
                ++indexing;
            }

            var x = s.x ? parseInt(s.x) : 0;
            var y = s.y ? parseInt(s.y) : 0;
            var z = (s.z ? parseInt(s.z) : 0) * count + j;

            var spriteFrame = this.spriteSheet.getSpriteFrame(s.name);
            
            var ac = {
                id: id,
                spriteFrame: spriteFrame,
                position: cc.p(x, -y),
                z: maxZ - z,
                angle: (s.angle ? parseInt(s.angle) : 0),
                flipH: (s.flipH ? parseInt(s.flipH) : 0) !== 0,
                flipV: (s.flipV ? parseInt(s.flipV) : 0) !== 0,
                scale: (s.scale ? parseInt(s.scale) : 100) * 0.01,
                opacity: s.opacity ? parseInt(s.opacity) : 255
            };

            frameCells.push(ac);
            frameCellsMap[ac.id] = ac;
        }

        clip.frames.push({
            time: currentTime,
            cells: frameCells,
            cellsMap: frameCellsMap
        });

        currentTime += c.delay;
    }

    clip.totalTime = currentTime;
    return clip;
}

dfSpriteAnimation.prototype.unload = function () {
    if (this.spriteSheet) {
        this.spriteSheet.unload();
    }
}

dfSpriteAnimation.prototype.getClip = function (animationName) {    
    return this.clips[animationName];
}

dfSpriteAnimation.prototype.createInstance = function () {
    var inst = new dfSpriteAnimationInstance(this);
}