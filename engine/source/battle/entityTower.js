import Defs from "./defs";

import Camera from "./camera";
import EntityBase from "./entityBase";

var EntityTower = EntityBase.extend({
    ctor: function (team, presentation) {
        this._super(team, presentation);

        this.sprite = new cc.Sprite("#tower_idle_0.png");
        this.addChild(this.sprite);
    },

    step: function (dt) {
        if (!this.stepLiveliness(dt)) {
            return false;
        }

        this._super(dt);
        return true;
    }
});

module.exports = EntityTower;
