import Defs from "./defs";

import Camera from "./camera";
import EntityBase from "./entityBase";
import approxDistance from "../utils/approxDistance";

var EntityEffectRocket = EntityBase.extend({
    ctor: function (team, presentation, owner, target, spriteName) {
        this._super(team, presentation);

        this.target = null;
        this.life = 1000;
        this.owner = owner;

        this.target = target;

        this.logic.x = this.owner.logic.x;
        this.logic.y = this.owner.logic.y;
        this.logic.z = this.owner.getSize() / 2;

        this.startX = this.logic.x;
        this.startY = this.logic.y;
        this.startDistance = approxDistance(this.target.logic.x - this.startX, this.target.logic.y - this.startY);

        this.zShift = 10;
        this.syncPosition();

        this.idleAction = this.createAnimAction({ name: spriteName || "effect_bulleta_idle", count: 1, loop: true });
        this.hitAction = this.createAnimAction({ name: "effect_bulletf_hit", count: 6, loop: false });
        this.state = Defs.UNIT_STATE_IDLE;

        this.sprite.runAction(this.idleAction);
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
            if (mag > this.target.getSize()) {
                var v = dt * 1.5;
                this.logic.x += dx / mag * v;
                this.logic.y += dy / mag * v;

                var awayDistance = approxDistance(this.logic.x - this.startX, this.logic.y - this.startY);
                if (awayDistance >= this.startDistance - this.target.getSize()) {
                    this.logic.x = this.target.logic.x;
                    this.logic.y = this.target.logic.y;
                    isHit = true;
                }
            } else {
                isHit = true;
            }

            this._futurePosition = this.convertPosition(this.logic.x, this.logic.y);

            if (!this.target.isAlive()) {
                isHit = true;
            }

            if (isHit) {
                this.sprite.runAction(this.hitAction);
                this.state = Defs.UNIT_STATE_ATTACK;

                var enemies = this.presentation.findEnemyInArea(this.owner, this.logic.x, this.logic.y, this.owner.attr.SplashRange || 200);
                for (var i = 0; i < enemies.length; ++i) {
                    enemies[i].damage(this.owner.getAttackFor(enemies[i].attr));
                }
            }

            this.sprite.setRotation(Math.atan2(dx, dy) * 180 / Math.PI);
        } else if (this.state === Defs.UNIT_STATE_ATTACK) {
            this.life -= dt;
        }

        return this.life > 0;
    }
});

module.exports = EntityEffectRocket;
