import Defs from "./defs";

import Camera from "./camera";
import EntityBase from "./entityBase";
import EntityEffectHit1 from "./entityEffectHit1";
import approxDistance from "../utils/approxDistance";

var EntityMeleeFighter = EntityBase.extend({
    setUnitData (data) {
        this._super(data);
        this.currentAction = this.animAction.idle;
        this.sprite.runAction(this.currentAction);
    },

    update: function (dt) {
        this._super(dt);

        this.animatePosition();
    },

    step: function (dt) {
        if (!this.stepLiveliness(dt)) return false;
        if (this.state === Defs.UNIT_STATE_DYING) return true;

        this._departurePosition = this.convertPosition(this.logic.x, this.logic.y);

        if (this.logic.cool > 0) {
            this.logic.cool -= dt;
            if (this.logic.cool < 0) {
                this.logic.cool = 0;
            }
        }

        if (this.state === Defs.UNIT_STATE_IDLE) {
            this.intentAction = this.animAction.idle;

            this.updateIdle();
        }

        if (this.state === Defs.UNIT_STATE_WALK) {
            this.intentAction = this.animAction.walk;
            this.lookForEnemy();

            var target = this.stateData.target;
            if (target && target.isAlive()) {
                var dx = target.logic.x - this.logic.x;
                var dy = target.logic.y - this.logic.y;
                var mag = approxDistance(dx, dy);

                if (mag > this.getRange()) {
                    var v = dt * this.getMoveSpeed() / 1000;

                    this.setFacing(dx > 0 ? 1 : -1);

                    this.logic.x += dx / mag * v;
                    this.logic.y += dy / mag * v;
                } else {
                    this.state = Defs.UNIT_STATE_ATTACK;
                }
            } else {
                if (this.isOfflane()) {
                    this.state = Defs.UNIT_STATE_IDLE;
                } else {
                    var v = dt * this.getMoveSpeed() / 1000;
                    if (this.team === 0) {
                        this.logic.y += v;
                    } else {
                        this.logic.y -= v;
                    }
                }
            }
        }

        if (this.state === Defs.UNIT_STATE_ATTACK) {
            var target = this.stateData.target;
            if (target && target.isAlive()) {
                if (this.logic.cool <= 0) {
                    var dist = this.getDistanceTo(target);
                    if (dist > this.getRange()) {
                        this.state = Defs.UNIT_STATE_WALK;
                    } else {
                        this.intentAction = this.animAction.attack;
                        this.currentAction = null;
                        this.logic.cool = this.getAttackCool();

                        this.createEffect(target);
                    }
                }
            } else {
                this.state = Defs.UNIT_STATE_IDLE;
            }
        }

        this._futurePosition = this.convertPosition(this.logic.x, this.logic.y);

        if (this.currentAction !== this.intentAction) {
            this.currentAction = this.intentAction;
            this.sprite.stopAllActions();
            this.sprite.runAction(this.currentAction);
        }
        return true;
    },

    createEffect: function (target) {
        var hit = new EntityEffectHit1(this.team, this.presentation, this, target);
        this.presentation.addEffect(hit);
    },

    lookForEnemy: function () {
        var enemy = this.presentation.findEnemy(this);
        if (enemy) {
            this.stateData.target = enemy;
        }
    },

    updateIdle: function () {
        var enemy = this.presentation.findEnemy(this);
        if (enemy) {
            this.state = Defs.UNIT_STATE_WALK;
            this.stateData.target = enemy;
        } else {
            if (this.isOfflane()) {
                var goal = this.presentation.findGoal(this);
                if (goal) {
                    this.state = Defs.UNIT_STATE_WALK;
                    this.stateData.target = goal;
                }
            } else {
                this.state = Defs.UNIT_STATE_WALK;
                this.stateData.target = null;
            }
        }
    }
});

module.exports = EntityMeleeFighter;
