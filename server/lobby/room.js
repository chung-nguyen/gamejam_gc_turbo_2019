var WebSocket = require("ws");

var UPDATE_INTERVAL = 200;
var READY_TIMEOUT = 1000;
var FINAL_TURN = 3 * 60 * 1000 / UPDATE_INTERVAL;
var LAGGED_TURN_COUNT = 10;
var OUTDATED_TIME = 1500 * 60 * 1000;

var MAX_PLAYERS = 2;

var Room = function (id) {
    this.id = id;
    this.players = [];
    this.isAlive = true;
    this.isReady = false;
    this.deployList = [];
    this.readyCountdown = 0;
    this.turnCount = 0;
    this.createdTime = Date.now();

    this._interval = setInterval(() => this.update(), UPDATE_INTERVAL);
};

Room.prototype.isOutdated = function () {
    return !this.isReady && Date.now() - this.createdTime >= OUTDATED_TIME;
};

Room.prototype.destroy = function () {
    if (this._interval) {
        clearInterval(this._interval);
        this._interval = null;
    }

    this.isAlive = false;
};

Room.prototype.isFull = function () {
    return this.players.length >= MAX_PLAYERS;
};

Room.prototype.registerPlayer = function (userData) {
    var p = this.getPlayer(userData.id);
    if (p) {
        return p.index;
    }

    var playerId = this.players.length;
    userData.index = playerId;
    userData.localTurn = 0;
    this.players.push(userData);
    return playerId;
};

Room.prototype.acceptConnection = function (userId) {
    var p = this.getPlayer(userId);
    return p != null;
};

Room.prototype.addConnection = function (ws) {
    var p = this.getPlayer(ws.userId);
    p.ws = ws;
};

Room.prototype.handleDisconnection = function (userId) {
    for (let i = this.players.length - 1; i >= 0; --i) {
        if (this.players[i].id === userId) {
            this.players[i] = this.players[this.players.length - 1];
            this.players.length -= 1;
        }
    }
};

Room.prototype.handleMessage = function (userId, message) {
    var data;
    try {
        data = JSON.parse(message);
    } catch (ex) {}

    if (!data) return;

    var p = this.getPlayer(userId);

    switch (data.type) {
        case "ping":
            this.sendTo(p, { type: "pong" });
            break;
        case "ready":
            this.handlePlayerReady(p, data);
            break;
        case "deploy":
            this.handleDeploy(p, data);
            break;
        case "ack":
            this.handleAck(p, data);
            break;
    }
};

Room.prototype.getPlayer = function (userId) {
    return this.players.find((it) => it.id === userId);
};

Room.prototype.update = function () {
    if (!this.isReady || !this.isAlive) return;

    if (this.readyCountdown > 0) {
        this.readyCountdown -= UPDATE_INTERVAL;
        return;
    }

    if (this.hasLaggedPlayer()) {
        this.sendAll({ type: "lagged" });
        return;
    }

    var deploy = this.deployList;
    this.deployList = [];

    var turn;
    if (this.turnCount >= FINAL_TURN) {
        this.isAlive = false;
        turn = { type: "timeOver" };
    } else {
        turn = { deploy, type: "turn", index: this.turnCount, dt: UPDATE_INTERVAL };
        ++this.turnCount;
    }

    this.sendAll(turn);
};

Room.prototype.hasLaggedPlayer = function () {
    for (var i = 0; i < this.players.length; ++i) {
        var p = this.players[i];
        if (this.turnCount - p.localTurn >= LAGGED_TURN_COUNT) {
            return true;
        }
    }

    return false;
};

Room.prototype.sendTo = function (player, message) {
    if (player.ws && player.ws.readyState === WebSocket.OPEN) {
        try {
            player.ws.send(JSON.stringify(message));
        } catch (ex) {
            console.error(ex);
        }
    }
};

Room.prototype.sendAll = function (message) {
    var data = JSON.stringify(message);
    this.players.forEach((p) => {
        if (p.ws && p.ws.readyState === WebSocket.OPEN) {
            try {
                p.ws.send(data);
            } catch (ex) {
                console.error(ex);
            }
        }
    });
};

Room.prototype.handlePlayerReady = function (p, data) {
    p.isReady = true;
    var readyCount = 0;
    this.players.forEach((p) => {
        if (p.isReady) {
            ++readyCount;
        }
    });

    this.isReady = readyCount === MAX_PLAYERS;
    if (this.isReady) {
        this.readyCountdown = READY_TIMEOUT;
        this.sendAll({ type: "ready" });
    }
};

Room.prototype.handleDeploy = function (p, data) {
    if (!this.isReady) return;

    this.deployList.push(Object.assign(data, { playerId: p.index }));
};

Room.prototype.handleAck = function (p, data) {
    p.localTurn = data.turn;
};

module.exports = Room;
