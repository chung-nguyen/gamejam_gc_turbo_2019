import Defs from "./defs";

import Camera from "./camera";
import approxDistance from "../utils/approxDistance";

var EntityBase = cc.Node.extend({
    ctor: function (team, presentation) {
        this._super();

        this.logic = {
            HP: 0,
            x: 0,
            y: 0
        };

        this.attr = {};

        this.team = team;
        this.presentation = presentation;
        this.setFacing(team === 0 ? 1 : -1);

        this.state = Defs.UNIT_STATE_IDLE;
        this.stateData = {
            target: null
        };

        this._departurePosition = cc.p(0, 0);
        this._futurePosition = cc.p(0, 0);
    },

    isAlive: function () {
        return this.logic.HP > 0;
    },

    setUnitData: function (data) {
        this.logic.HP = data.HP;
        this.attr = data;
    },

    setFacing: function (value) {
        var camRot = Camera.rotate;
        if (value < 0) {
            if (camRot === 0) {
                this.setScaleX(-1);
            } else {
                this.setScaleX(-1);
                this.setScaleY(-1);
            }
        } else {
            if (camRot === 0) {
                this.setScaleX(1);
            } else {
                this.setScaleX(1);
                this.setScaleY(-1);
            }
        }
    },

    setLocation: function (x, y) {
        this.logic.x = x;
        this.logic.y = y;

        this.setPosition(this.convertPosition(x, y));
    },

    convertPosition: function (x, y) {
        return cc.p(x * Defs.ARENA_CELL_WIDTH / 100, y * Defs.ARENA_CELL_HEIGHT / 100);
    },

    update: function (dt) {
    },

    step: function (dt) {
        this._departurePosition = this.convertPosition(this.logic.x, this.logic.y);
        this._timeFrameCounter = 0;
    },

    getDistanceTo: function (target) {
        var dx = target.logic.x - this.logic.x;
        var dy = target.logic.y - this.logic.y;
        return approxDistance(dx, dy);
    },

    animatePosition: function () {
        var t = this.presentation.timeFrameCounter / this.presentation.stepTime;
        var pos = cc.p(cc.lerp(this._departurePosition.x, this._futurePosition.x, t), cc.lerp(this._departurePosition.y, this._futurePosition.y, t))
        this.setPosition(pos);
    }
});

module.exports = EntityBase;
