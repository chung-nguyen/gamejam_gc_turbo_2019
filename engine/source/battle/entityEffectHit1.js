import Defs from "./defs";

import Camera from "./camera";
import EntityBase from "./entityBase";
import approxDistance from "../utils/approxDistance";

var EntityEffectHit1 = EntityBase.extend({
    ctor: function (team, presentation, owner, target) {
        this._super(team, presentation);

        this.sprite = new cc.Sprite("#hit1_idle_0.png");
        this.addChild(this.sprite);

        this.target = null;
        this.life = 500;
        this.owner = owner;

        this.target = target;

        this.logic.x = target.logic.x;
        this.logic.y = target.logic.y - 10;
        this.logic.z = target.attr.Size;

        this.syncPosition();

        target.damage(this.owner.attr.Damage);
    },

    step: function (dt) {
        this._super(dt);

        this.life -= dt;
        return this.life > 0;
    }
});

module.exports = EntityEffectHit1;