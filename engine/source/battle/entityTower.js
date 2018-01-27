import Defs from "./defs";

import Camera from "./camera";
import EntityBase from "./entityBase";
import EntityEffectHit1 from "./entityEffectHit1";
import EntityEffectBullet from "./entityEffectBullet";

var EntityTower = EntityBase.extend({
    setUnitData (data) {
        this._super(data);
        this.sprite.runAction(this.animAction.idle);
    },

    step: function (dt) {
        if (!this.stepLiveliness(dt)) return false;
        if (this.state === Defs.UNIT_STATE_DYING) return true;

        this._super(dt);

        if (this.state === Defs.UNIT_STATE_IDLE) {
            var enemy = this.presentation.findEnemy(this);
            if (enemy) {
                this.stateData.target = enemy;
                this.sprite.runAction(this.animAction.attack);
                this.state = Defs.UNIT_STATE_ATTACK;
            }
        }

        if (this.state === Defs.UNIT_STATE_ATTACK) {
            var target = this.stateData.target;
            if (target && target.isAlive()) {
                if (this.logic.cool <= 0) {
                    this.logic.cool = this.attr.Cool;

                    var hit = new EntityEffectBullet(this.team, this.presentation, this, target);
                    this.presentation.addEffect(hit);
                }
            } else {
                this.sprite.runAction(this.animAction.idle);
                this.state = Defs.UNIT_STATE_IDLE;
            }
        }
        return true;
    }
});

module.exports = EntityTower;
