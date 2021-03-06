import Defs from "./defs";

var DummyEntity = cc.Node.extend({
    ctor: function () {
        this._super(0);

        this.offsetX = 0;
        this.offsetY = 0;

        this.sprite = null;
    },

    snap: function (name, team) {
        var unitData = Defs.UNIT_DATA[name];

        this.sprite = new cc.Sprite("#" + unitData.animation.idle.name + "_0.png");
        this.sprite.setOpacity(128);
        this.addChild(this.sprite);
    },

    setFacing: function (value) {
        this.facing = value;
        this.setScaleX(value < 0 ? 1 : -1);
        this.setScaleY(value < 0 ? -1 : 1);
    },

    update: function (dt) {},

    setOffset: function (x, y) {
        this.offsetX = x;
        this.offsetY = y;
    }
});

module.exports = DummyEntity;
