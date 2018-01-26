var Room = function (id) {
    this.id = id;
    this.players = [];
    this.isAlive = true;
    this.isReady = false;
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
    }
};

Room.prototype.getPlayer = function (userId) {
    return this.players.find((it) => it.id === userId);
};

Room.prototype.update = function (dt) {
    if (!this.isReady) return;
};

Room.prototype.sendTo = function (player, message) {
    try {
        player.ws.send(JSON.stringify(message));
    } catch (e) {
    }
};

Room.prototype.sendAll = function (message) {
    var data = JSON.stringify(message);
    this.players.forEach((p) => {
        try {
            p.ws.send(data)
        } catch (e) {
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
        this.sendAll({ type: "ready" });
    }
};

module.exports = Room;
