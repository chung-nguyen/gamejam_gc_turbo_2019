// @flow

var GameLogic = function(opts: object) {
    this.level = opts.level;

    this.boats = [];
    this.fishermen = [];
    this.hooks = [];
    this.fishes = [];
    this.fishLines = [];

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
};

GameLogic.prototype.step = function(dt: Number) {
    var fishDefs = this.level.fishDefs;
    var lines = this.level.lines;
    var players = this.level.players;

    for (var i = 0; i < lines.length; ++i) {
        var fishLine = this.fishLines[i];
        var { area, direction, schools } = fishLine.info;

        fishLine.nextTimeout -= dt;
        if (fishLine.nextTimeout <= 0) {
            if (fishLine.currentSchool) {
                fishLine.nextTimeout = fishLine.currentSchool.gap;
                var startingX = direction > 0 ? area.x : area.x + area.width;

                // TODO...
                var newFish = {
                    x: startingX
                };

                this.fishes.push(newFish);

                --fishLine.schoolCount;
                if (fishLine.schoolCount <= 0) {
                    fishLine.currentSchool = null;
                    fishLine.nextTimeout =
                        fishLine.currentSchool.nextSchoolGap[0] +
                        Math.floor(Math.random() * (fishLine.currentSchool.nextSchoolGap[1] - fishLine.currentSchool.nextSchoolGap[0]));
                }
            } else {
                fishLine.currentSchool = schools[Math.min(Math.floor(Math.random() * schools.length), schools.length - 1)];
                fishLine.schoolCount =
                    fishLine.currentSchool.count[0] + Math.floor(Math.random() * (fishLine.currentSchool.count[1] - fishLine.currentSchool.count[0]));
                fishLine.nextTimeout = 0;
                fishLine.latestFish = null;
            }
        }
        
        for (var i = 0; i < this.fishes.length; ++i) {
            var fish = this.fishes[i];

            // TODO
            // ...
        }
    }
};

GameLogic.prototype.getEntities = function() {
    return {
        boats: this.boats,
        fishermen: this.fishermen,
        hooks: this.hooks,
        fishes: this.fishes
    };
};

GameLogic.prototype.sendCommand = function(command: object) {
    return true;
};

module.exports = GameLogic;
