var Settings = require("./settings");

var url = require("url");


var Room = require("./room");

var Lobby = function(ws) {
    this.rooms = [];
    this.idCounter = 0;

    this.wss = ws;

    this.wss.on("connection", (ws, req) => {
        var location = url.parse(req.url, true);
        var userId = location.query.userId;
        var roomId = parseInt(location.query.roomId);

        var room = this.getRoom(roomId);
        if (userId && room) {
            if (room.acceptConnection(userId)) {
                ws.userId = userId;
                ws.roomId = roomId;

                room.addConnection(ws);

                ws.on("close", () => {
                    var userId = ws.userId;

                    var room = this.getRoom(ws.roomId);
                    if (room != null) {
                        room.handleDisconnection(userId);
                    }
                });

                ws.on("message", message => {
                    var room = this.getRoom(ws.roomId);
                    if (room != null) {
                        room.handleMessage(ws.userId, message);
                    }
                });

                ws.on("error", err => console.error(err));
            } else {
                ws.close(1001, "room_unauthorized");
            }
        } else {
            ws.close(1000, "room_not_found");
        }
    });

    setInterval(() => this.update(), 5000);
};

Lobby.prototype.createRoom = function(user) {
    return new Promise((resolve, reject) => {
        var room;

        for (var i = this.rooms.length - 1; i >= 0; --i) {
            var it = this.rooms[i];
            if (it.isAlive && !it.isReady && !it.isFull()) {
                room = it;
            }
        }

        if (!room) {
            ++this.idCounter;
            room = new Room(this.idCounter);
            this.rooms.push(room);
        }

        var roomId = room.id;
        var playerId = room.registerPlayer(user);
        resolve({
            playerId,
            roomId
        });
    });
};

Lobby.prototype.getRoom = function(roomId) {
    return this.rooms.find(it => it.id === roomId);
};

Lobby.prototype.update = function() {
    for (var i = this.rooms.length - 1; i >= 0; --i) {
        var room = this.rooms[i];
        if (!room.isAlive || room.isOutdated()) {
            room.destroy();

            this.rooms[i] = this.rooms[this.rooms.length - 1];
            this.rooms.length--;
        }
    }
};

const createLobby = ws => new Lobby(ws);
let lobby = null;
module.exports = ws => {
    if (!lobby) {
        lobby = new Lobby(ws);
    }
    return lobby;
};
