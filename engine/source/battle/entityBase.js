import Defs from "./defs";

import Camera from "./camera";

var EntityBase = cc.Node.extend({
    ctor: function (team) {
        this._super();

        this.logic = {
            HP: 0,
            x: 0,
            y: 0
        };

        this.attr = {};

        this.team = team;
        this.setFacing(team === 0 ? 1 : -1);
    },

    setUnitData: function (name) {
        var data = Defs.UNIT_DATA[name];
        if (data) {
            this.logic.HP = data.HP;
            this.attr = data;
        }
    },

    setFacing: function (value) {
        var camRot = Camera.rotate;
        if (value < 0) {
            if (camRot === 0) {

            } else {
                this.setScaleY(-1);
            }
        } else {
            if (camRot === 0) {

            } else {
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
    }
});

module.exports = EntityBase;
