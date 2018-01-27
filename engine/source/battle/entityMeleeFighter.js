import Defs from "./defs";

import Camera from "./camera";
import EntityBase from "./entityBase";

var EntityMeleeFighter = EntityBase.extend({
    ctor: function (team) {
        this._super(team);

        this.sprite = new cc.Sprite("#dummy_idle_0.png");
        this.addChild(this.sprite);
    },

    setUnitData: function (data) {
        this._super(data);
    }
});

module.exports = EntityMeleeFighter;
