import SocketClient from "../common/socketClient";
import { getStoreState } from "../store/store";

var config = require('config');

class Battle {
    constructor () {
        this.socket = new SocketClient();
        this.isReady = false;
    }

    connect () {
        var room = getStoreState().room;
        var authenticate = getStoreState().authenticate;
        this.socket.connect(config.socketUrl, {
            userId: authenticate.id,
            roomId: room.roomId,
            accessToken: authenticate.accessToken
        });
    }

    close () {
        this.socket.close();
    }

    send (message) {
        this.socket.send(message);
    }

    update (dt) {
        this.send({ type: "ping" });

        var message = this.socket.popMessage();
        if (message) {
            cc.log(message);
        }
    }
}

module.exports = Battle;