import Defs from "./defs";
import Camera from "./camera";
import EntityTower from "./entityTower";
import EntityHQ from "./entityHQ";

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
    },

    init: function () {
        var leftTower1 = new EntityTower(0);
        leftTower1.setLocation(650, 350);
        this.root.addChild(leftTower1);

        var leftTower2 = new EntityTower(0);
        leftTower2.setLocation(650, 1450);
        this.root.addChild(leftTower2);

        var leftHQ = new EntityHQ(0);
        leftHQ.setLocation(300, 900);
        this.root.addChild(leftHQ);

        var rightTower1 = new EntityTower(0);
        rightTower1.setLocation(2550, 350);
        this.root.addChild(rightTower1);

        var rightTower2 = new EntityTower(0);
        rightTower2.setLocation(2550, 1450);
        this.root.addChild(rightTower2);

        var rightHQ = new EntityHQ(0);
        rightHQ.setLocation(2900, 900);
        this.root.addChild(rightHQ);
    },

    update: function (dt) {

    },

    deploy: function (data) {

    },

    step: function (dt) {

    }
});

module.exports = Presentation;