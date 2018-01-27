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

        this.timeFrameCounter = 0;
        this.stepTime = 1;
    },

    rotate: function (angle) {
        this.setRotation(angle);
    },

    init: function () {
        this.leftGoals.push(this.deploy({ name: "tower", x: 650, y: 350, playerId: 0 }));
        this.leftGoals.push(this.deploy({ name: "tower", x: 650, y: 1450, playerId: 0 }));
        this.leftGoals.push(this.deploy({ name: "hq", x: 300, y: 900, playerId: 0 }));

        this.rightGoals.push(this.deploy({ name: "tower", x: 2550, y: 350, playerId: 1 }));
        this.rightGoals.push(this.deploy({ name: "tower", x: 2550, y: 1450, playerId: 1 }));
        this.rightGoals.push(this.deploy({ name: "hq", x: 2900, y: 900, playerId: 1 }));

        this.energy = 5000;
    },

    update: function (dt) {
        this.timeFrameCounter += dt;

        for (var i = 0; i < this.units.length; ++i) {
            this.units[i].update(dt);
        }
    },

    deploy: function (deployment) {
        var unitData = Defs.UNIT_DATA[deployment.name];
        if (!unitData) return;

        var Klass = ENTITY_KLASS_MAP[unitData.Klass];
        if (!Klass) return;

        var e = new Klass(deployment.playerId, this);
        e.setUnitData(unitData);
        e.setLocation(deployment.x, deployment.y);
        this.units.push(e);
        this.root.addChild(e);
        this.energy -= unitData.Cost * 1000;

        return e;
    },

    step: function (dt) {
        this.timeFrameCounter = 0;
        this.stepTime = dt;

        this.energy += dt * 2;
        if (this.energy > 10000) {
            this.energy = 10000;
        }

        for (var i = 0; i < this.units.length; ++i) {
            this.units[i].step(dt);
        }
    },

    findGoal: function (entity) {
        var team = entity.team;
        var goals = team === 0 ? this.rightGoals : this.leftGoals;
        var res;
        var dist = Defs.BIG_DISTANCE;
        for (var i = 0; i < goals.length; ++i) {
            var g = goals[i];
            if (g.isAlive()) {
                var d = g.getDistanceTo(entity);
                if (d < dist) {
                    res = g;
                    dist = d;
                }
            }
        }

        return res;
    }
});

module.exports = Presentation;