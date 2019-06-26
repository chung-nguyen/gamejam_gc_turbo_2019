import Defs from "./defs";

class Formation {
    constructor (team) {
        this.team = team;
        this.units = [];
    }

    add (deployment) {
        this.units.push(deployment);
    }

    getOffsetX () {
        return (Defs.ARENA_WIDTH / 2) * 100 / Defs.ARENA_CELL_WIDTH;
    }

    getOffsetY () {
        var h = (Defs.ARENA_HEIGHT / 2) * 100 / Defs.ARENA_CELL_HEIGHT;
        return this.team === 0 ? -h : h;
    }
}

module.exports = Formation;
