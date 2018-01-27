import Defs from "./defs";

import Camera from "./camera";
import EntityMeleeFighter from "./entityMeleeFighter";
import EntityEffectFlame from "./entityEffectFlame";
import approxDistance from "../utils/approxDistance";

var EntityFlameThrower = EntityMeleeFighter.extend({
    createEffect: function (target) {
        var hit = new EntityEffectFlame(this.team, this.presentation, this, target);
        this.presentation.addEffect(hit);
    }
});

module.exports = EntityFlameThrower;