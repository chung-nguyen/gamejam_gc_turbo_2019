import POKEMONS from "../config/pokemons";

var SCREEN_SIZE = cc.winSize;
var SCREEN_CENTER = cc.p(SCREEN_SIZE.width / 2, SCREEN_SIZE.height / 2);

var BATTLE_HEIGHT = 1408;
var ACTION_BAR_HEIGHT = 100;
var ACTION_BAR_WIDTH = SCREEN_SIZE.width * 0.5;
var ACTION_BUTTON_SIZE = 64;

var ACTION_FIELD_WIDTH = 640;
var ACTION_FIELD_HEIGHT = 320;

var TOP_BAR_WIDTH = SCREEN_SIZE.width;
var TOP_BAR_HEIGHT = 80;

var BATTLE_SCALE = SCREEN_SIZE.height / BATTLE_HEIGHT;
var BATTLE_POSITION = cc.p(0, 0);

var ARENA_WIDTH = 576;
var ARENA_HEIGHT = 1024;
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

var ACTION_BUTTON_WIDTH = 120;
var ACTION_BUTTON_HEIGHT = 160;
var ACTION_BUTTON_GAP = 30;

var UNIT_DATA = {
    hq: {
        hp: 6000,
        attack: 80,
        defense: 0,
        Size: 100,
        Range: 700,
        Sight: 700,
        Cool: 880,
        Speed: 0,
        Cost: 0,
        Klass: "entityHQ",
        animation: {
            idle: { name: "hq_idle", count: 1, loop: true },
            attack: { name: "hq_attack", count: 1, loop: false },
            die: { name: "hq_die", count: 1, loop: false }
        },
        armor: 'heavy'
    },
    tower: {
        hp: 4000,
        attack: 20,
        defense: 0,
        Size: 100,
        Range: 700,
        Sight: 700,
        Cool: 220,
        Speed: 0,
        Cost: 0,
        Klass: "entityTower",
        animation: {
            idle: { name: "tower_idle", count: 1, loop: true },
            attack: { name: "tower_attack", count: 1, loop: false },
            die: { name: "tower_die", count: 15, loop: false }
        },
        armor: 'heavy'
    }
}

module.exports = {
    SCREEN_SIZE,

    BATTLE_HEIGHT,

    TOP_BAR_WIDTH,
    TOP_BAR_HEIGHT,

    ACTION_FIELD_WIDTH,
    ACTION_FIELD_HEIGHT,

    ACTION_BAR_WIDTH,
    ACTION_BUTTON_SIZE,
    ACTION_BAR_HEIGHT,

    ACTION_BUTTON_WIDTH,
    ACTION_BUTTON_HEIGHT,
    ACTION_BUTTON_GAP,

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

    POKEMONS,
    UNIT_DATA,
    ANIMATION_FPS,

    UNIT_STATE_IDLE,
    UNIT_STATE_WALK,
    UNIT_STATE_ATTACK,
    UNIT_STATE_DYING
};
