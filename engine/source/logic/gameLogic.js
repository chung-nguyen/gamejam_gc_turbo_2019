// @flow
import Chance from "../utils/chance";
import Fish from "./fish";
import Hook from "./hook";

var GameLogic = function(opts: object) {
    this.level = opts.level;
    this.bounds = opts.bounds;

    this.reset();
};

GameLogic.prototype.reset = function() {
    var lines = this.level.lines;

    this.fishLines = [];
    for (var i = 0; i < lines.length; ++i) {
        this.fishLines.push({
            info: lines[i],
            currentSchool: null,
            schoolCount: 0,
            nextTimeout: 0,
            latestFish: null
        });
    }

    this.chance = new Chance(Date.now());
    this.idCounter = 0;

    this.boats = [];
    this.fishermen = [];
    this.fishes = [];

    var players = this.level.players;

    this.hooks = [
        new Hook({
            position: players[0].hookPosition,
            initialLength: 200,
            size: 20,
            collision: players[0].collision
        })
    ];
};

GameLogic.prototype.getFishData = function(name: string) {
    var fishDefs = this.level.fishDefs;
    return fishDefs[name];
};

GameLogic.prototype.step = function(dt: Number) {
    this.updateHooks(dt);
    this.updateFishes(dt);
};

GameLogic.prototype.updateHooks = function (dt: Number) {
    for (var i = 0; i < this.hooks.length; ++i) {
        var hook = this.hooks[i];
        hook.move(dt);

        if (hook.isThrowing) {
            for (var j = this.fishes.length - 1; j >= 0; --j) {
                var fish = this.fishes[j];

                if (hook.testCollisionWithFish(fish)) {
                    hook.catchFish(fish);
                    hook.pull();
                    break;
                }
            }
        }
    }
}

GameLogic.prototype.updateFishes = function(dt: Number) {
    var fishDefs = this.level.fishDefs;
    var lines = this.level.lines;

    for (var i = 0; i < lines.length; ++i) {
        var fishLine = this.fishLines[i];
        var { area, direction, speed, schools } = fishLine.info;

        fishLine.nextTimeout -= dt;
        if (fishLine.nextTimeout <= 0) {
            if (fishLine.currentSchool) {
                fishLine.nextTimeout = this.chance.integer({
                    min: fishLine.currentSchool.gap[0],
                    max: fishLine.currentSchool.gap[1]
                });

                var startingX = direction > 0 ? area.x : area.x + area.width;
                var type =
                    fishLine.currentSchool.type[
                        this.chance.integer({
                            min: 0,
                            max: fishLine.currentSchool.type.length - 1
                        })
                    ];
                var data = this.getFishData(type);

                ++this.idCounter;
                var newFish = new Fish({
                    type,
                    direction,
                    speed,
                    data,
                    id: this.idCounter,
                    x: startingX - data.width,
                    y: area.y + this.chance.integer({ min: 0, max: area.height })
                });

                this.fishes.push(newFish);

                --fishLine.schoolCount;
                if (fishLine.schoolCount <= 0) {
                    fishLine.nextTimeout = this.chance.integer({
                        min: fishLine.currentSchool.nextSchoolGap[0],
                        max: fishLine.currentSchool.nextSchoolGap[1]
                    });

                    fishLine.currentSchool = null;
                }
            } else {
                fishLine.currentSchool = schools[this.chance.integer({ min: 0, max: schools.length - 1 })];
                fishLine.schoolCount = this.chance.integer({ min: fishLine.currentSchool.count[0], max: fishLine.currentSchool.count[1] });
                fishLine.nextTimeout = 0;
                fishLine.latestFish = null;
            }
        }
    }

    for (var i = this.fishes.length - 1; i >= 0; --i) {
        var fish = this.fishes[i];
        fish.move(dt);

        if (fish.isOutBound(this.bounds) || fish.isDead) {
            var t = this.fishes[this.fishes.length - 1];
            this.fishes[this.fishes.length - 1] = fish;
            this.fishes[i] = t;
            --this.fishes.length;
        }
    }
}

GameLogic.prototype.getEntities = function() {
    return {
        boats: this.boats,
        fishermen: this.fishermen,
        hooks: this.hooks,
        fishes: this.fishes
    };
};

GameLogic.prototype.sendCommand = function(command: object) {
    // TODO: select the right hook if multiplayer
    var myHook = this.hooks[0];

    myHook.throw();
    return true;
};

GameLogic.ACTION = 1;

module.exports = GameLogic;
