import Defs from "./defs";

import Camera from "./camera";

var DummyEntity = cc.Node.extend({
    ctor: function() {
        this._super(0);

        this.offsetX = 0;
        this.offsetY = 0;

        this.sprite = null;
    },

    snap: function (name, team) {
        this.sprite = new cc.Sprite("#" + name + "_idle_0.png");
        this.addChild(this.sprite);
    },

    setFacing: function(value) {
        this.facing = value;
        this.setScaleX(value < 0 ? -1 : 1);
        this.setScaleY(value < 0 ? -1 : 1);
    },

    update: function(dt) {},

    setOffset: function (x, y) {
        this.offsetX = x;
        this.offsetY = y;
    }
});

module.exports = DummyEntity;
