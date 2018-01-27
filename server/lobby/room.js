var WebSocket = require("ws");

var UPDATE_INTERVAL = 100;
var READY_TIMEOUT = 1000;

var Room = function (id) {
    this.id = id;
    this.players = [];
    this.isAlive = true;
    this.isReady = false;
    this.deployList = [];
    this.readyCountdown = 0;
    this.turnCount = 0;

    this._interval = setInterval(() => this.update(), UPDATE_INTERVAL);
};

Room.prototype.destroy = function () {
    if (this._interval) {
        clearInterval(this._interval);
        this._interval = null;
    }
};

Room.prototype.isFull = function () {
    return this.players.length >= 2;
};

Room.prototype.registerPlayer = function (userData) {
    var p = this.getPlayer(userData.id);
    if (p) {
        return p.index;
    }

    var playerId = this.players.length;
    userData.index = playerId;
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
    var p = this.getPlayer(userId);
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
    }
};

Room.prototype.getPlayer = function (userId) {
    return this.players.find((it) => it.id === userId);
};

Room.prototype.update = function () {
    if (!this.isReady) return;

    if (this.readyCountdown > 0) {
        this.readyCountdown -= UPDATE_INTERVAL;
        return;
    }

    var deploy = this.deployList;
    this.deployList = [];

    var turn = { deploy, type: "turn", index: this.turnCount, dt: UPDATE_INTERVAL };
    ++this.turnCount;

    this.sendAll(turn);
};

Room.prototype.sendTo = function (player, message) {
    if (player.ws && player.ws.readyState === WebSocket.OPEN) {
        player.ws.send(JSON.stringify(message));
    }
};

Room.prototype.sendAll = function (message) {
    var data = JSON.stringify(message);
    this.players.forEach((p) => {
        if (p.ws && p.ws.readyState === WebSocket.OPEN) {
            p.ws.send(data);
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

    this.isReady = readyCount === 2;
    if (this.isReady) {
        this.readyCountdown = READY_TIMEOUT;
        this.sendAll({ type: "ready" });
    }
};

Room.prototype.handleDeploy = function (p, data) {
    if (!this.isReady) return;

    this.deployList.push(Object.assign(data, { playerId: p.index }));
}

module.exports = Room;
