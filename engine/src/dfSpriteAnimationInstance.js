function binarySearch(array, target) {

    var startIndex = 0,
        stopIndex = array.length - 1,
        middle;

    if (target >= array[stopIndex].time) {
        return stopIndex;
    }

    while (startIndex < stopIndex) {
        middle = ((stopIndex + startIndex) >> 1);

        var value = array[middle].time;
        if (target >= value && (middle === array.length - 1 || target <= array[middle + 1].time)) {
            break;
        }

        // adjust search area
        if (target < value) {
            stopIndex = middle;
        } else if (target > value) {
            startIndex = middle;
        }
    }

    //make sure it's the right value
    return (array[middle].time <= target) ? middle : 0;
}

var dfSpriteAnimationInstance = cc.Node.extend({
    ctor: function (prefab) {
        this._super();

        this.prefab = prefab;
        this.spriteFrameNodes = {};
        this.time = 0;
        this.animationSpeed = 30;

        this.currentClip = null;
        this.currentFrame = null;
    },

    update: function (dt) {
        this.setTime(this.time + dt * this.animationSpeed);
    },

    setAnimation: function (name) {
        this.currentClip = this.prefab.getClip(name);
    },

    setAnimationSpeed: function (speed) {
        this.animationSpeed = speed;
    },

    setFrame: function (index) {
        if (!this.currentClip) {
            return;
        }

        var count = this.currentClip.frames.length;
        var frame = this.currentFrame = this.currentClip.frames[~~(index % count)];

        this.time = frame.time;
        this.applyFrameCells(frame.cells);
    },

    setTime: function (time) {
        if (!this.currentClip) {
            return;
        }
        
        var totalTime = this.currentClip.totalTime;

        this.time = time % totalTime;

        var frames = this.currentClip.frames;

        var t = 0;
        var frameIndex = binarySearch(frames, this.time);
        var left = frames[frameIndex];
        var right = frameIndex < frames.length - 1 ? frames[frameIndex + 1] : frames[0];

        if (left.time < right.time) {
            t = (this.time - left.time) / (right.time - left.time);
        } else {
            t = (this.time - left.time) / (totalTime - left.time);
        }

        this.applyFrameCells(this.interpolateFrame(left, right, t));
    },

    applyFrameCells: function (cells) {
        for (var k in this.spriteFrameNodes) {
            this.spriteFrameNodes[k].setVisible(false);
        }

        for (var i = 0; i < cells.length; ++i) {
            var c = cells[i];

            var node = this.spriteFrameNodes[c.id];
            if (!node) {
                node = new cc.Sprite(c.spriteFrame);
                node.setLocalZOrder(c.z);
                this.addChild(node);

                this.spriteFrameNodes[c.id] = node;
            }

            node.setPosition(c.position);
            node.setRotation(c.angle);
            node.setOpacity(c.opacity);
            node.setScale(c.scale);
            node.setFlippedX(c.flipH);
            node.setFlippedY(c.flipV);
            node.setLocalZOrder(c.z);
            node.setVisible(true);
        }
    },

    interpolateFrame: function (a, b, t) {
        var cells = [];
        for (var i = 0; i < a.cells.length; ++i) {
            var c = a.cells[i];

            var d = b.cellsMap[c.id];

            if (!d) {
                cells.push(c);
            } else {
                cells.push({
                    id: c.id,
                    spriteFrame: c.spriteFrame,
                    flipH: c.flipH,
                    flipV: c.flipV,
                    position: c.position,
                    z: cc.lerp(c.z, d.z, t),
                    angle: cc.angleLerp(c.angle, d.angle, t),
                    scale: cc.lerp(c.scale, d.scale, t),
                    opacity: cc.lerp(c.opacity, d.opacity, t)
                });
            }
        }

        return cells;
    }
});
