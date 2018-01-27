import Defs from "./defs";

import Camera from "./camera";
import EntityMeleeFighter from "./entityMeleeFighter";
import EntityEffectBullet from "./entityEffectBullet";
import approxDistance from "../utils/approxDistance";

var EntityGunner = EntityMeleeFighter.extend({
    createEffect: function (target) {
        var hit = new EntityEffectBullet(this.team, this.presentation, this, target);
        this.presentation.addEffect(hit);
    }
});

module.exports = EntityGunner;