import Defs from "./defs";
import Camera from "./camera";
import EntityTower from "./entityTower";
import EntityHQ from "./entityHQ";
import EntityMeleeFigher from "./entityMeleeFighter";
import EntityFlameThrower from "./entityFlameThrower";
import EntityGunner from "./entityGunner";
import EntityGiant from "./entityGiant";
import EntityAxeman from "./entityAxeman";

var ENTITY_KLASS_MAP = {
    entityHQ: EntityHQ,
    entityTower: EntityTower,
    entityMeleeFighter: EntityMeleeFigher,
    entityFlameThrower: EntityFlameThrower,
    entityGunner: EntityGunner,
    entityGiant: EntityGiant,
    entityAxeman: EntityAxeman
};

var TRIPLE_FORMATION = [ { dx: 0, dy: 0 }, { dx: -120, dy: -120 }, { dx: -120, dy: 120 } ];

var Presentation = cc.Node.extend({
    ctor: function (opts) {
        this._super();

        this.entities = [];
        this.team = opts.team;

        this.root = new cc.Node();
        this.root.setPosition(cc.p(-Defs.ARENA_WIDTH / 2, -Defs.ARENA_HEIGHT / 2));
        this.addChild(this.root, 0);

        this.energy = 0;
        this.leftGoals = [];
        this.rightGoals = [];
        this.units = [];
        this.effects = [];

        this.timeFrameCounter = 0;
        this.stepTime = 1;
        this.result = null;
    },

    rotate: function (angle) {
        this.setRotation(angle);
    },

    init: function () {
        this.leftGoals.push(this.deploy({ name: "tower", x: 900, y: 650, playerId: 0 }));
        this.leftGoals.push(this.deploy({ name: "hq", x: 900, y: 100, playerId: 0 }));

        this.rightGoals.push(this.deploy({ name: "tower", x: 900, y: 2550, playerId: 1 }));
        this.rightGoals.push(this.deploy({ name: "hq", x: 900, y: 3100, playerId: 1 }));

        this.energy = 1000;
    },

    update: function (dt) {
        this.timeFrameCounter += dt * 1000;

        for (var i = 0; i < this.units.length; ++i) {
            this.units[i].update(dt);
        }

        for (var i = 0; i < this.effects.length; ++i) {
            this.effects[i].update(dt);
        }
    },

    deploy: function (deployment) {
        var unitData = Defs.UNIT_DATA[deployment.name];
        if (!unitData) return;

        var Klass = ENTITY_KLASS_MAP[unitData.Klass];
        if (!Klass) return;

        var e;
        if (unitData.Count === 3) {
            for (var i = 0; i < unitData.Count; ++i) {
                e = this.spawnUnit(
                    Klass,
                    deployment.playerId,
                    deployment.x + TRIPLE_FORMATION[i].dx,
                    deployment.y + TRIPLE_FORMATION[i].dy,
                    unitData
                );
            }
        } else {
            e = this.spawnUnit(Klass, deployment.playerId, deployment.x, deployment.y, unitData);
        }

        if (deployment.playerId === this.team) {
            this.energy -= unitData.Cost * 1000;
        }
        return e;
    },

    spawnUnit: function (Klass, team, x, y, unitData) {
        var e = new Klass(team, this);
        e.setUnitData(unitData);
        e.setLocation(x, y);
        this.units.push(e);
        this.root.addChild(e);
        return e;
    },

    addEffect: function (effect) {
        this.effects.push(effect);
        this.root.addChild(effect);
    },

    step: function (dt) {
        this.timeFrameCounter = 0;
        this.stepTime = dt;

        this.energy += dt / 2;
        if (this.energy > 10000) {
            this.energy = 10000;
        }

        for (var i = this.units.length - 1; i >= 0; --i) {
            var u = this.units[i];
            if (!u.step(dt)) {
                this.units[i] = this.units[this.units.length - 1];
                this.units.length--;
                u.removeFromParent();
            }
        }

        for (var i = this.effects.length - 1; i >= 0; --i) {
            var e = this.effects[i];
            if (!e.step(dt)) {
                this.effects[i] = this.effects[this.effects.length - 1];
                this.effects.length--;
                e.removeFromParent();
            }
        }

        var leftHQ = this.leftGoals[this.leftGoals.length - 1];
        var rightHQ = this.rightGoals[this.rightGoals.length - 1];
        if (!leftHQ.isActive()) {
            if (!rightHQ.isActive()) {
                this.result = { winnerId: -1 };
            } else {
                this.result = { winnerId: 1 };
            }
        } else if (!rightHQ.isActive()) {
            if (!leftHQ.isActive()) {
                this.result = { winnerId: -1 };
            } else {
                this.result = { winnerId: 0 };
            }
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
    },

    findEnemy: function (entity) {
        var res;
        var dist = Defs.BIG_DISTANCE;
        for (var i = 0; i < this.units.length; ++i) {
            var g = this.units[i];
            if (g.isAlive() && g.team !== entity.team && entity.canAttack(g) && entity.canSee(g)) {
                var d = g.getDistanceTo(entity);
                if (d < dist) {
                    res = g;
                    dist = d;
                }
            }
        }

        return res;
    },

    findEnemyInArea: function (entity, x, y, r) {
        var res = [];
        for (var i = 0; i < this.units.length; ++i) {
            var g = this.units[i];
            if (g.isAlive() && g.team !== entity.team && entity.canAttack(g)) {
                var d = g.getDistanceToPos(x, y);
                if (d < r) {
                    res.push(g);
                }
            }
        }

        return res;
    }
});

module.exports = Presentation;
