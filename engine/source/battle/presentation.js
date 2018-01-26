import Defs from "./defs";
import Camera from "./camera";

var Presentation = cc.Node.extend({
    ctor: function () {
        this._super();

        this.entities = [];

        this.root = new cc.Node();
        this.root.setPosition(cc.p(-Defs.ARENA_WIDTH / 2, -Defs.ARENA_HEIGHT / 2));
        this.addChild(this.root, 0);
    },

    rotate: function (angle) {
        this.setRotation(angle);
    }
});

module.exports = Presentation;