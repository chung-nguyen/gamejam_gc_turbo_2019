var SCREEN_SIZE = cc.winSize;
var SCREEN_CENTER = cc.p(SCREEN_SIZE.width / 2, SCREEN_SIZE.height / 2);

var BATTLE_WIDTH = 1408;
var ACTION_BAR_HEIGHT = 260;
var ACTION_BAR_WIDTH = SCREEN_SIZE.width - 300;

var BATTLE_SCALE = SCREEN_SIZE.width / BATTLE_WIDTH;
var BATTLE_POSITION = cc.p(0, 120);

var ARENA_WIDTH = 1024;
var ARENA_HEIGHT = 576;
var ARENA_CELL_WIDTH = 32;
var ARENA_CELL_HEIGHT = 32;

var MAX_CARDS_PER_ROUND = 4;

var UNIT_DATA = {
    hq: {
        HP: 100,
        Damage: 10,
        Size: 1,
        Range: 5,
        Cool: 1000,
        Cost: 0
    },
    tower: {
        HP: 100,
        Damage: 10,
        Size: 1,
        Range: 5,
        Cool: 1000,
        Cost: 0
    },
    dummy: {
        HP: 100,
        Damage: 10,
        Size: 1,
        Range: 1,
        Cool: 1000,
        Cost: 2
    }
}

module.exports = {
    SCREEN_SIZE,

    BATTLE_WIDTH,
    ACTION_BAR_WIDTH,
    ACTION_BAR_HEIGHT,

    SCREEN_CENTER,
    BATTLE_SCALE,
    BATTLE_POSITION,

    ARENA_WIDTH,
    ARENA_HEIGHT,
    ARENA_CELL_WIDTH,
    ARENA_CELL_HEIGHT,

    MAX_CARDS_PER_ROUND,

    UNIT_DATA
};
