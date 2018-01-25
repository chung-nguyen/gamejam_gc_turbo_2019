var Room = function (id) {
    this.id = id;
    this.players = [];
}

Room.prototype.isFull = function () {
    return this.players.length >= 2;
}

Room.prototype.registerPlayer = function (userData) {
    var p = this.getPlayer(userData.id);
    if (p) {
        return p.index;
    }

    var playerId = this.players.length;
    userData.index = playerId;
    this.players.push(userData);
    return playerId;
}

Room.prototype.acceptConnection = function (userId) {
    var p = this.getPlayer(userId);
    return p != null;
}

Room.prototype.addConnection = function (ws) {
    var p = this.getPlayer(ws.userId);
    p.ws = ws;
}

Room.prototype.handleDisconnection = function (userId) {
    var p = this.getPlayer(userId);;
}

Room.prototype.handleMessage = function (userId, message) {
    var data;
    try {
        data = JSON.parse(message);
    } catch (ex) {
    }

    if (!data) return;

    var p = this.getPlayer(userId);

    if (data.type === "ping") {
        p.ws.send(JSON.stringify({ type: "pong" }));
    }
}

Room.prototype.getPlayer = function (userId) {
    return this.players.find(it => it.id === userId);
}

module.exports = Room;