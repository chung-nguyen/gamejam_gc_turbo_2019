var Room = function (id) {
    this.id = id;
    this.players = [];
}

Room.prototype.isFull = function () {
    return this.players.length >= 2;
}

Room.prototype.registerPlayer = function (userData) {
    var playerId = this.players.length;
    this.players.push(userData);
    return playerId;
}

module.exports = Room;