var Hook = cc.Node.extend({
    ctor: function () {
        this._super();

        this.origin = new cc.Sprite("#hookOrigin.png");
        this.addChild(this.origin, 1);

        this.tip = new cc.Sprite("#hook.png");
        this.addChild(this.tip, 2);

        this.ropes = [];
        this._maxLength = 0;
    }
});

Hook.prototype.reset = function (opts) {
    while (this._maxLength < opts.maxLength) {
        var rope = new cc.Sprite("#rope.png");

        this._maxLength += rope.getContentSize().height;
        this.ropes.push(rope);

        if (this.ropes.length > 1) {
            this.ropes[this.ropes.length - 2].addChild(rope, 0);
            rope.setAnchorPoint(0, 1);
        } else {
            this.addChild(rope, 0);
            rope.setAnchorPoint(0.5, 1);
        }
    }
};

Hook.prototype.setDirection = function (angle, length) {
    var a = angle * Math.PI / 180;

    var dx = Math.cos(a);
    var dy = Math.sin(a);

    this.tip.setPosition(dx * length, dy * length);

    var ra = 270 - angle;
    this.tip.setRotation(ra);

    if (this.ropes.length > 0) {
        this.ropes[0].setRotation(ra);
        var len = 0;
        this.ropes.forEach((rope) => {
            var rl = rope.getContentSize().height;
            if (len < length) {
                rope.setVisible(true);

                if (len + rl > length) {
                    rope.setScale(1, (length - len) / rl);
                } else {
                    rope.setScale(1, 1);
                }
            } else {
                rope.setVisible(false);
            }

            len += rl;
        });
    }
};

Hook.prototype.setTipPosition = function (pos) {
    this.tip.setPosition(pos);
};

module.exports = Hook;
