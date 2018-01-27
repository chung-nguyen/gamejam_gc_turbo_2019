import Defs from "./defs";

import Camera from "./camera";
import EntityBase from "./entityBase";
import EntityEffectHit1 from "./entityEffectHit1";
import approxDistance from "../utils/approxDistance";

var EntityMeleeFighter = EntityBase.extend({
    setUnitData (data) {
        this._super(data);
        this.sprite.runAction(this.animAction.idle);
    },

    update: function (dt) {
        this._super(dt);

        this.animatePosition();
    },

    step: function (dt) {
        if (!this.stepLiveliness(dt)) {
            return false;
        }

        this._super(dt);

        if (this.state === Defs.UNIT_STATE_IDLE) {
            var enemy = this.presentation.findEnemy(this);
            if (enemy) {
                this.state = Defs.UNIT_STATE_WALK;
                this.sprite.runAction(this.animAction.walk);
                this.stateData.target = enemy;
            } else {
                var goal = this.presentation.findGoal(this);
                if (goal) {
                    this.state = Defs.UNIT_STATE_WALK;
                    this.sprite.runAction(this.animAction.walk);
                    this.stateData.target = goal;
                }
            }
        }

        if (this.state === Defs.UNIT_STATE_WALK) {
            var enemy = this.presentation.findEnemy(this);
            if (enemy) {
                this.stateData.target = enemy;
            }

            var target = this.stateData.target;
            if (target && target.isAlive()) {
                var dx = target.logic.x - this.logic.x;
                var dy = target.logic.y - this.logic.y;
                var mag = approxDistance(dx, dy);

                if (mag > this.attr.Range) {
                    var v = dt * this.attr.Speed / 1000;

                    this.setFacing(dx > 0 ? 1 : -1);

                    this.logic.x += dx * v / mag;
                    this.logic.y += dy * v / mag;
                } else {
                    this.state = Defs.UNIT_STATE_ATTACK;
                    this.sprite.runAction(this.animAction.attack);
                }
            } else {
                this.state = Defs.UNIT_STATE_IDLE;
                this.sprite.runAction(this.animAction.idle);
            }
        }

        if (this.state === Defs.UNIT_STATE_ATTACK) {
            var target = this.stateData.target;
            if (target && target.isAlive()) {
                if (this.logic.cool <= 0) {
                    this.logic.cool = this.attr.Cool;

                    var hit = new EntityEffectHit1(this.team, this.presentation, this, target);
                    this.presentation.addEffect(hit);
                }
            } else {
                this.state = Defs.UNIT_STATE_IDLE;
                this.sprite.runAction(this.animAction.idle);
            }
        }

        this._futurePosition = this.convertPosition(this.logic.x, this.logic.y);
        return true;
    }
});

module.exports = EntityMeleeFighter;
