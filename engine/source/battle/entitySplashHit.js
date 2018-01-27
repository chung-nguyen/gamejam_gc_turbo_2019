import Defs from "./defs";

import Camera from "./camera";
import EntityBase from "./entityBase";
import approxDistance from "../utils/approxDistance";

var EntitySplashHit = EntityBase.extend({
    ctor: function (team, presentation, owner, target) {
        this._super(team, presentation);

        this.target = null;
        this.life = 1000;
        this.owner = owner;

        this.target = target;

        this.logic.x = target.logic.x;
        this.logic.y = target.logic.y;
        this.logic.z = owner.attr.Size;

        this.zShift = 10;
        this.syncPosition();

        this.animAction = this.createAnimAction({ name: "hit1_idle", count: 1, loop: false });
        this.state = Defs.UNIT_STATE_IDLE;
    },

    step: function (dt) {
        this._super(dt);

        if (this.life <= 200 && this.state === Defs.UNIT_STATE_IDLE) {
            this.sprite.runAction(this.animAction);
            this.state = Defs.UNIT_STATE_ATTACK;

            var enemies = this.presentation.findEnemyInArea(this.owner, this.logic.x, this.logic.y, this.owner.attr.SplashRange);
            for (var i = 0; i < enemies.length; ++i) {
                enemies[i].damage(this.owner.attr.Damage);
            }
        }

        this.life -= dt;
        return this.life > 0;
    }
});

module.exports = EntitySplashHit;