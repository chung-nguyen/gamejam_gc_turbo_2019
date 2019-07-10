import Defs from "./defs";

import Camera from "./camera";
import EntityMeleeFighter from "./entityMeleeFighter";
import EntityEffectRocket from "./entityEffectRocket";
import approxDistance from "../utils/approxDistance";

var EntitySiege = EntityMeleeFighter.extend({
    createEffect: function (target) {
        var hit = new EntityEffectRocket(this.team, this.presentation, this, target, this.attr.bulletName);
        this.presentation.addEffect(hit);
    }
});

module.exports = EntitySiege;