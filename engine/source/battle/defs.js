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
var BIG_DISTANCE = 2 * ARENA_WIDTH * ARENA_HEIGHT;

var MAX_CARDS_PER_ROUND = 4;
var TURN_PADDING = 4;

var UNIT_STATE_IDLE = 0;
var UNIT_STATE_WALK = 1;
var UNIT_STATE_ATTACK = 2;
var UNIT_STATE_DYING = 3;

var ANIMATION_FPS = 30;

var UNIT_DATA = {
    hq: {
        HP: 100,
        Damage: 10,
        Size: 100,
        Range: 600,
        Sight: 500,
        Cool: 1000,
        Speed: 0,
        Cost: 0,
        Klass: "entityHQ",
        animation: {
            idle: { name: "tower_idle", count: 1, loop: true },
            attack: { name: "tower_attack", count: 1, loop: false },
            die: { name: "tower_die", count: 1, loop: false }
        }
    },
    tower: {
        HP: 100,
        Damage: 10,
        Size: 100,
        Range: 600,
        Sight: 500,
        Cool: 1000,
        Speed: 0,
        Cost: 0,
        Klass: "entityTower",
        animation: {
            idle: { name: "tower_idle", count: 1, loop: true },
            attack: { name: "tower_attack", count: 1, loop: false },
            die: { name: "tower_die", count: 1, loop: false }
        }
    },
    dummy: {
        HP: 100,
        Damage: 100,
        Size: 100,
        Range: 150,
        Sight: 500,
        Cool: 1000,
        Speed: 100,
        Cost: 2,
        Klass: "entityMeleeFighter",
        animation: {
            idle: { name: "dummy_idle", count: 1, loop: true },
            walk: { name: "dummy_walk", count: 4, loop: true },
            attack: { name: "dummy_attack", count: 4, loop: false },
            die: { name: "dummy_die", count: 4, loop: false }
        }
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
    BIG_DISTANCE,

    MAX_CARDS_PER_ROUND,
    TURN_PADDING,

    UNIT_DATA,
    ANIMATION_FPS,

    UNIT_STATE_IDLE,
    UNIT_STATE_WALK,
    UNIT_STATE_ATTACK,
    UNIT_STATE_DYING
};
