import Defs from "./defs";
import Camera from "./camera";
import Formation from "./formation";
import EntityTower from "./entityTower";
import EntityHQ from "./entityHQ";
import EntityMeleeFigher from "./entityMeleeFighter";
import EntityGunner from "./entityGunner";
import EntityHealer from "./entityHealer";
import EntitySiege from "./entitySiege";
import EntityDual from "./entityDual";

var ENTITY_KLASS_MAP = {
    entityHQ: EntityHQ,
    entityTower: EntityTower
};

var TRIPLE_FORMATION = [ { dx: 0, dy: 0 }, { dx: -120, dy: -120 }, { dx: -120, dy: 120 } ];

var Presentation = cc.Node.extend({
    ctor: function (opts) {
        this._super();

        this.entities = [];
        this.team = opts.team;
        this.actionBar = opts.actionBar;
        this.actionBar.presentation = this;

        this.root = new cc.Node();
        this.root.setPosition(cc.p(-Defs.ARENA_WIDTH / 2, -Defs.ARENA_HEIGHT / 2));
        this.addChild(this.root, 0);

        this.gold = 0;
        this.time = 0;

        this.leftGoals = [];
        this.rightGoals = [];
        this.units = [];
        this.effects = [];

        this.timeFrameCounter = 0;
        this.stepTime = 1;
        this.result = null;

        this.formations = [];
    },

    rotate: function (angle) {
        this.setRotation(angle);
    },

    init: function () {
        this.leftGoals.push(this.build({ name: "tower", x: 900, y: 650, playerId: 0 }));
        this.leftGoals.push(this.build({ name: "hq", x: 900, y: 50, playerId: 0 }));

        this.rightGoals.push(this.build({ name: "tower", x: 900, y: 2550, playerId: 1 }));
        this.rightGoals.push(this.build({ name: "hq", x: 900, y: 3150, playerId: 1 }));

        this.gold = 200000;
        this.time = 10000;

        this.formations = [];
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

    build: function (deployment) {
        var unitData = Defs.UNIT_DATA[deployment.name];
        if (!unitData) return;

        var Klass = ENTITY_KLASS_MAP[unitData.Klass];
        if (!Klass) return;

        var e = this.spawnUnit(Klass, deployment.playerId, deployment.x, deployment.y, unitData);
        return e;
    },

    deploy: function (deployment) {
        var team = deployment.playerId;
        var formation = this.formations[team];
        if (!formation) {
            formation = new Formation(team);
            this.formations[team] = formation;
        }

        var unitData = Defs.POKEMONS.find((it) => it.pokedex === deployment.name);
        if (!unitData) return;

        var cost = unitData.total || 100;

        formation.add(deployment);

        if (formation.team === this.team) {
            this.actionBar.setFormation(formation);
        }
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

        this.gold += dt * 10;
        this.time -= dt;

        if (this.time <= 0) {
            this.time = 10000;
            this.deployAllFormations();
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

    findEnemies: function (entity, count) {
        var res = [];
        for (var i = 0; i < this.units.length; ++i) {
            var g = this.units[i];
            if (g.isAlive() && g.team !== entity.team && entity.canAttack(g) && entity.canSee(g)) {
                res.push(g);
                count--;
                if (count <= 0) {
                    break;
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
    },

    findWoundedAlly: function (entity) {
        var res;
        var dist = Defs.BIG_DISTANCE;
        for (var i = 0; i < this.units.length; ++i) {
            var g = this.units[i];
            if (g.isAlive() && g.isWounded() && g.team === entity.team && entity.canAttack(g) && entity.canSee(g)) {
                var d = g.getDistanceTo(entity);
                if (d < dist) {
                    res = g;
                    dist = d;
                }
            }
        }

        return res;
    },

    deployAllFormations: function () {
        for (let i = 0; i < this.formations.length; ++i) {
            this.deployFormation(this.formations[i]);
        }
    },

    deployFormation: function (formation) {
        if (!formation) {
            return;
        }

        for (let i = 0; i < formation.units.length; ++i) {
            var unit = formation.units[i];

            var unitData = Defs.POKEMONS.find((it) => it.pokedex === unit.name);
            if (!unitData) return;

            var Klass = null;
            switch (unitData.klass) {
                case "gunner":
                    Klass = EntityGunner;
                    break;
                case "healer":
                    Klass = EntityHealer;
                    break;
                case "siege":
                    Klass = EntitySiege;
                    break;
                case "dual":
                    Klass = EntityDual;
                    break;
            }

            if (!Klass) return;

            var x = unit.x * 64 * 100 / Defs.ARENA_CELL_WIDTH;
            var y = unit.y * 64 * 100 / Defs.ARENA_CELL_HEIGHT;
            if (formation.team === 1) {
                y = -y;
            }

            this.spawnUnit(Klass, formation.team, x + formation.getOffsetX(), y + formation.getOffsetY(), unitData);
        }
    }
});

module.exports = Presentation;
