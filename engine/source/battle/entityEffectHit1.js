import Defs from "./defs";

import Camera from "./camera";
import EntityBase from "./entityBase";
import approxDistance from "../utils/approxDistance";

var EntityEffectHit1 = EntityBase.extend({
    ctor: function (team, presentation, owner, target) {
        this._super(team, presentation);

        this.target = null;
        this.life = 600;
        this.owner = owner;

        this.target = target;

        this.logic.x = target.logic.x;
        this.logic.y = target.logic.y;
        this.logic.z = target.attr.Size;

        this.zShift = 10;
        this.syncPosition();

        this.animAction = this.createAnimAction({ name: "hit1_idle", count: 1, loop: false });
        this.state = Defs.UNIT_STATE_IDLE;
    },

    step: function (dt) {
        this._super(dt);

        if (this.life <= 400 && this.state === Defs.UNIT_STATE_IDLE) {
            this.sprite.runAction(this.animAction);
            this.state = Defs.UNIT_STATE_ATTACK;

            this.target.damage(this.owner.attr.Damage);
        }

        this.life -= dt;
        return this.life > 0;
    }
});

module.exports = EntityEffectHit1;