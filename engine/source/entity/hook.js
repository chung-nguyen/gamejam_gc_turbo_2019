var Hook = cc.Node.extend({
    ctor: function() {
        this._super();

        this.origin = new cc.Sprite("#hookOrigin.png");
        this.addChild(this.origin, 0);

        this.tip = new cc.Sprite('#hook.png');
        this.addChild(this.tip, 1);

        this.reset();
    }
});

Hook.prototype.reset = function() {
}

Hook.prototype.setDirection = function (angle, length) {
    var a = angle * Math.PI / 180;

    var dx = Math.cos(a);
    var dy = Math.sin(a);

    this.tip.setPosition(dx * length, dy * length);
    this.tip.setRotation(270 - angle);
}

Hook.prototype.setTipPosition = function (pos) {
    this.tip.setPosition(pos);
}

module.exports = Hook;