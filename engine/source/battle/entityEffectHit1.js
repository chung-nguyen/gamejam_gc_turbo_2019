import Defs from "./defs";

import Camera from "./camera";
import EntityBase from "./entityBase";
import approxDistance from "../utils/approxDistance";

var EntityEffectHit1 = EntityBase.extend({
    ctor: function (team, presentation, owner, target) {
        this._super(team, presentation);

        this.target = null;
        this.life = 500;
        this.owner = owner;

        this.target = target;

        this.logic.x = target.logic.x;
        this.logic.y = target.logic.y;
        this.logic.z = target.attr.Size;

        this.zShift = 10;
        this.syncPosition();

        target.damage(this.owner.attr.Damage);

        var animAction = this.createAnimAction({ name: "hit1_idle", count: 1, loop: false });
        this.sprite.runAction(animAction);
    },

    step: function (dt) {
        this._super(dt);

        this.life -= dt;
        return this.life > 0;
    }
});

module.exports = EntityEffectHit1;