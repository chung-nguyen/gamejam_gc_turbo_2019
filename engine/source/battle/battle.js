import SocketClient from "../common/socketClient";
import { getStoreState } from "../store/store";
import Defs from "./defs";

import Camera from "./camera";
import Presentation from "./presentation";

var config = require("config");

var State = {
    LOADING: 0,
    WAITING: 1,
    RUNNING: 2,
    GAMEOVER: 3
};

var Battle = cc.Layer.extend({
    ctor: function () {
        this._super();
        this.socket = new SocketClient();
        this.state = State.LOADING;
    },

    isReady: function () {
        return this.state === State.RUNNING;
    },

    init: function () {
        var room = getStoreState().room;

        this.ground = new cc.Sprite("#ground.png");
        this.ground.setPosition(
            cc.p(Defs.SCREEN_CENTER.x + Defs.BATTLE_POSITION.x, Defs.SCREEN_CENTER.y + Defs.BATTLE_POSITION.y)
        );
        this.ground.setScale(Defs.BATTLE_SCALE);
        this.addChild(this.ground);

        this.presentation = new Presentation();
        this.ground.addChild(this.presentation, 10);

        Camera.setRotate(room.playerId === 0 ? 0 : 180);
        this.presentation.rotate(Camera.rotate);
    },

    connect: function () {
        var room = getStoreState().room;
        var authenticate = getStoreState().authenticate;
        this.socket.connect(config.socketUrl, {
            userId: authenticate.id,
            roomId: room.roomId,
            accessToken: authenticate.accessToken
        });
    },

    close: function () {
        this.socket.close();
    },

    send: function (message) {
        this.socket.send(message);
    },

    update: function (dt) {
        if (this.state === State.LOADING && this.socket.isReady) {
            this.send({ type: "ready" });
            this.state = State.WAITING;
        }

        var message = this.socket.popMessage();
        if (message) {
            switch (message.type) {
                case "ready":
                    this.handleReady(message);
                    break;

                case "result":
                    this.handleResult(message);
                    break;

                case "turn":
                    this.handleTurn(message);
                    break;
            }
        }
    },

    handleReady: function (message) {
        cc.log("Battle ready!");
        this.state = State.RUNNING;
    },

    handleResult: function (message) {},

    handleTurn: function (message) {}
});

module.exports = Battle;
