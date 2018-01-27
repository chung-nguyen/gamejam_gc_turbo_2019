import Defs from "./defs";

import Camera from "./camera";
import EntityMeleeFighter from "./entityMeleeFighter";
import approxDistance from "../utils/approxDistance";

var EntityGiant = EntityMeleeFighter.extend({
    lookForEnemy: function () {
        return;
    },

    updateIdle: function () {
        var goal = this.presentation.findGoal(this);
        if (goal) {
            this.state = Defs.UNIT_STATE_WALK;
            this.stateData.target = goal;
        }
    }
});

module.exports = EntityGiant;