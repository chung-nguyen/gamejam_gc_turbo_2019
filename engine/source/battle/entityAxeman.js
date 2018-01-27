import Defs from "./defs";

import Camera from "./camera";
import EntityMeleeFighter from "./entityMeleeFighter";
import EntitySplashHit from "./entitySplashHit";
import approxDistance from "../utils/approxDistance";

var EntityAxeman = EntityMeleeFighter.extend({
    createEffect: function (target) {
        var hit = new EntitySplashHit(this.team, this.presentation, this, target);
        this.presentation.addEffect(hit);
    }
});

module.exports = EntityAxeman;