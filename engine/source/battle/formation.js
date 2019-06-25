import Defs from "./defs";

class Formation {
    constructor (team) {
        this.team = team;
        this.units = [];
    }

    add (deployment) {
        this.units.push(deployment);
    }

    getOffsetY () {
        var h = (Defs.BATTLE_HEIGHT / 3) * 100 / Defs.ARENA_CELL_HEIGHT;
        return this.team === 0 ? -h : h;
    }
}

module.exports = Formation;
