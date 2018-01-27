import Defs from "./defs";

import Camera from "./camera";
import EntityBase from "./entityBase";
import approxDistance from "../utils/approxDistance";

var EntityEffectBullet = EntityBase.extend({
    ctor: function (team, presentation, owner, target) {
        this._super(team, presentation);

        this.target = null;
        this.life = 300;
        this.owner = owner;

        this.target = target;

        this.logic.x = this.owner.logic.x + this.owner.facing * this.owner.attr.Size;
        this.logic.y = this.owner.logic.y;
        this.logic.z = this.owner.attr.Size;

        this.startX = this.logic.x;
        this.startY = this.logic.y;
        this.startDistance = approxDistance(this.target.logic.x - this.startX, this.target.logic.y - this.startY);

        this.zShift = 10;
        this.syncPosition();

        this.idleAction = this.createAnimAction({ name: "effect_bullet_idle", count: 5, loop: true });
        this.hitAction = this.createAnimAction({ name: "effect_bullet_idle", count: 1, loop: true });
        this.state = Defs.UNIT_STATE_IDLE;

        this.sprite.runAction(this.idleAction);
        this.setFacing(this.owner.facing);
    },

    update: function (dt) {
        this._super(dt);
        this.animatePosition();
    },

    step: function (dt) {
        this._super(dt);

        if (this.state === Defs.UNIT_STATE_IDLE) {
            var isHit = false;
            var dx = this.target.logic.x - this.logic.x;
            var dy = this.target.logic.y - this.logic.y;
            var mag = approxDistance(dx, dy);
            if (mag > this.target.attr.Size) {
                var v = dt * 1.5;
                this.logic.x += dx / mag * v;
                this.logic.y += dy / mag * v;

                var awayDistance = approxDistance(this.logic.x - this.startX, this.logic.y - this.startY);
                if (awayDistance >= this.startDistance - this.target.attr.Size) {
                    this.logic.x = this.target.logic.x;
                    this.logic.y = this.target.logic.y;
                    isHit = true;
                }
            } else {
                isHit = true;
            }

            this._futurePosition = this.convertPosition(this.logic.x, this.logic.y);

            if (isHit) {
                this.sprite.runAction(this.hitAction);
                this.state = Defs.UNIT_STATE_ATTACK;
                this.target.damage(this.owner.attr.Damage);
            }
        } else if (this.state === Defs.UNIT_STATE_ATTACK) {
            this.life -= dt;
        }

        return this.life > 0;
    }
});

module.exports = EntityEffectBullet;