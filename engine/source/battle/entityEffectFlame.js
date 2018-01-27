import Defs from "./defs";

import Camera from "./camera";
import EntityBase from "./entityBase";
import approxDistance from "../utils/approxDistance";

var EntityEffectFlame = EntityBase.extend({
    ctor: function (team, presentation, owner, target) {
        this._super(team, presentation);

        this.target = null;
        this.life = 2000;
        this.owner = owner;

        this.target = target;

        this.logic.x = this.owner.logic.x + this.owner.facing * 300;
        this.logic.y = this.owner.logic.y;
        this.logic.z = this.owner.attr.Size;

        this.zShift = 10;
        this.syncPosition();

        this.animAction = this.createAnimAction({ name: "effect_fire_idle", count: 15, loop: true });
        this.sprite.runAction(this.animAction);

        this.setFacing(this.owner.facing);
        this.damageCool = this.owner.attr.DamageInterval;
    },

    step: function (dt) {
        this._super(dt);

        if (this.damageCool <= 0) {
            this.damageCool = this.owner.attr.DamageInterval;

            var enemies = this.presentation.findEnemyInArea(this.owner, this.target.logic.x, this.target.logic.y, this.owner.attr.SplashRange);
            for (var i = 0; i < enemies.length; ++i) {
                enemies[i].damage(this.owner.attr.Damage);
            }
        } else {
            this.damageCool -= dt;
        }

        this.life -= dt;
        return this.owner.isAlive() && this.life > 0;
    }
});

module.exports = EntityEffectFlame;