import Defs from "./defs";
import Camera from "./camera";
import EntityTower from "./entityTower";
import EntityHQ from "./entityHQ";
import EntityMeleeFigher from "./entityMeleeFighter";

var ENTITY_KLASS_MAP = {
    "entityHQ": EntityHQ,
    "entityTower": EntityTower,
    "entityMeleeFighter": EntityMeleeFigher
};

var Presentation = cc.Node.extend({
    ctor: function () {
        this._super();

        this.entities = [];

        this.root = new cc.Node();
        this.root.setPosition(cc.p(-Defs.ARENA_WIDTH / 2, -Defs.ARENA_HEIGHT / 2));
        this.addChild(this.root, 0);

        this.energy = 0;
        this.leftGoals = [];
        this.rightGoals = [];
        this.units = [];
    },

    rotate: function (angle) {
        this.setRotation(angle);
    },

    init: function () {
        this.leftGoals.push(this.deploy({ name: "tower", x: 650, y: 350 }));
        this.leftGoals.push(this.deploy({ name: "tower", x: 650, y: 1450 }));
        this.leftGoals.push(this.deploy({ name: "hq", x: 300, y: 900 }));

        this.rightGoals.push(this.deploy({ name: "tower", x: 2550, y: 350 }));
        this.rightGoals.push(this.deploy({ name: "tower", x: 2550, y: 1450 }));
        this.rightGoals.push(this.deploy({ name: "hq", x: 2900, y: 900 }));

        this.energy = 0;
    },

    update: function (dt) {

    },

    deploy: function (deployment) {
        var unitData = Defs.UNIT_DATA[deployment.name];
        if (!unitData) return;

        var Klass = ENTITY_KLASS_MAP[unitData.Klass];
        if (!Klass) return;

        var e = new Klass(deployment.playerId);
        e.setUnitData(unitData);
        e.setLocation(deployment.x, deployment.y);
        this.units.push(e);
        this.root.addChild(e);
        this.energy -= unitData.Cost * 1000;

        return e;
    },

    step: function (dt) {
        this.energy += dt * 2;
        if (this.energy > 10000) {
            this.energy = 10000;
        }
    }
});

module.exports = Presentation;