var Room = require('./room');

var Lobby = function () {
    this.rooms = [];
    this.idCounter = 0;
}

Lobby.prototype.createRoom = function (user) {
    return new Promise((resolve, reject) => {
        var room;

        this.rooms.forEach(it => {
            if (!it.isFull()) {
                room = it;
            }
        })

        if (!room) {
            ++this.idCounter;
            room = new Room(this.idCounter);
        }

        var roomId = room.id;
        var playerId = room.registerPlayer(user);
        resolve({
            playerId,
            roomId
        });
    });
}

module.exports = Lobby;