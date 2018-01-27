import Defs from "./defs";

import Camera from "./camera";
import EntityBase from "./entityBase";
import approxDistance from "../utils/approxDistance";

var EntityMeleeFighter = EntityBase.extend({
    ctor: function (team, presentation) {
        this._super(team, presentation);

        this.sprite = new cc.Sprite("#dummy_idle_0.png");
        this.addChild(this.sprite);
    },

    setUnitData: function (data) {
        this._super(data);
    },

    update: function (dt) {
        this._super(dt);

        this.animatePosition();
    },

    step: function (dt) {
        this._super(dt);

        if (this.state === Defs.UNIT_STATE_IDLE) {
            var goal = this.presentation.findGoal(this);
            if (goal) {
                this.state = Defs.UNIT_STATE_WALK;
                this.stateData.target = goal;
            }
        }

        if (this.state === Defs.UNIT_STATE_WALK) {
            var target = this.stateData.target;
            if (target && target.isAlive()) {
                var dx = target.logic.x - this.logic.x;
                var dy = target.logic.y - this.logic.y;
                var mag = approxDistance(dx, dy);
                var v = dt * this.attr.Speed / 1000;

                this.logic.x += dx * v / mag;
                this.logic.y += dy * v / mag;
            } else {
                this.state = Defs.UNIT_STATE_IDLE;
            }
        }

        this._futurePosition = cc.p(this.logic.x, this.logic.y);
    }
});

module.exports = EntityMeleeFighter;
