import Defs from "./defs";

import Camera from "./camera";
import EntityMeleeFighter from "./entityMeleeFighter";
import EntityEffectHeal from "./entityEffectHeal";
import approxDistance from "../utils/approxDistance";

var EntityHealer = EntityMeleeFighter.extend({
    createEffect: function (target) {
        var hit = new EntityEffectHeal(this.team, this.presentation, this, target, this.attr.bulletName);
        this.presentation.addEffect(hit);
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
            this.lookForAlly();

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
                var v = dt * this.getMoveSpeed() / 1000;
                if (this.team === 0) {
                    this.logic.y += v;
                } else {
                    this.logic.y -= v;
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

    updateIdle: function () {
        var enemy = this.presentation.findWoundedAlly(this);
        if (enemy) {
            this.state = Defs.UNIT_STATE_WALK;
            this.stateData.target = enemy;
        } else {
            this.state = Defs.UNIT_STATE_WALK;
            this.stateData.target = null;
        }
    },

    lookForAlly: function () {
        var enemy = this.presentation.findWoundedAlly(this);
        if (enemy) {
            this.stateData.target = enemy;
        }
    },
});

module.exports = EntityHealer;