// @flow

var GameLogic = function(opts: object) {
    this.level = opts.level;
    this.bounds = opts.bounds;

    this.idCounter = 0;

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

    this.idCounter = 0;
    
    this.boats = [];
    this.fishermen = [];
    this.hooks = [];
    this.fishes = [];
};

GameLogic.prototype.getFishData = function (name: string) {
    var fishDefs = this.level.fishDefs;
    return fishDefs[name];
}

GameLogic.prototype.step = function(dt: Number) {
    var fishDefs = this.level.fishDefs;
    var lines = this.level.lines;
    var players = this.level.players;

    for (var i = 0; i < lines.length; ++i) {
        var fishLine = this.fishLines[i];
        var { area, direction, speed, schools } = fishLine.info;

        fishLine.nextTimeout -= dt;
        if (fishLine.nextTimeout <= 0) {
            if (fishLine.currentSchool) {
                fishLine.nextTimeout = fishLine.currentSchool.gap;
                var startingX = direction > 0 ? area.x : area.x + area.width;

                ++this.idCounter;
                var newFish = {
                    direction,
                    speed,
                    id: this.idCounter,
                    type: fishLine.currentSchool.type[Math.min(Math.random() * fishLine.currentSchool.type.length, fishLine.currentSchool.type.length - 1)],
                    x: startingX,
                    y: area.y + Math.random() * area.height
                };

                this.fishes.push(newFish);

                --fishLine.schoolCount;
                if (fishLine.schoolCount <= 0) {
                    fishLine.nextTimeout =
                        fishLine.currentSchool.nextSchoolGap[0] +
                        Math.floor(Math.random() * (fishLine.currentSchool.nextSchoolGap[1] - fishLine.currentSchool.nextSchoolGap[0]));
                    fishLine.currentSchool = null;
                }
            } else {
                fishLine.currentSchool = schools[Math.min(Math.floor(Math.random() * schools.length), schools.length - 1)];
                fishLine.schoolCount =
                    fishLine.currentSchool.count[0] + Math.floor(Math.random() * (fishLine.currentSchool.count[1] - fishLine.currentSchool.count[0]));
                fishLine.nextTimeout = 0;
                fishLine.latestFish = null;
            }
        }        
    }

    for (var i = this.fishes.length - 1; i >= 0; --i) {
        var fish = this.fishes[i];        
        fish.x += fish.direction * fish.speed;
        console.log(fish);
        if (fish.x > this.bounds.right) {
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
