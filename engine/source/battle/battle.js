import SocketClient from "../common/socketClient";
import { getStoreState } from "../store/store";
import Defs from "./defs";

import Camera from "./camera";
import Presentation from "./presentation";
import ActionBar from "./actionBar";
import ActionTouchpad from "./actionTouchpad";
import ui from "../utils/ui";

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

        var groundSize = this.ground.getContentSize();
        this.presentation = new Presentation();
        this.presentation.setPosition(groundSize.width / 2, groundSize.height / 2);
        this.ground.addChild(this.presentation, 10);

        this.actionBar = new ActionBar({ maxEnergy: 10, battleRoot: this.presentation.root, socket: this.socket });
        this.actionBar.setAnchorPoint(0, 0);
        this.actionBar.setPosition(ui.relativeTo(this, ui.LEFT_BOTTOM, 0, 0));
        this.addChild(this.actionBar, 40);

        var touchpad = new ActionTouchpad({
            contentSize: cc.size(Defs.SCREEN_SIZE.width, Defs.SCREEN_SIZE.height),
            actionBar: this.actionBar,
            battleRoot: this.presentation.root
        });

        touchpad.setArenaSize(32, 18);

        this.addChild(touchpad, 50);
        this.touchpad = touchpad;

        this.actionBar.setVisible(false);
        this.touchpad.setVisible(false);

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

        var room = getStoreState().room;
        this.actionBar.setCurrentCards(room.playerId, ["dummy"]);

        this.actionBar.setVisible(true);
        this.touchpad.setVisible(true);

        this.presentation.init();
    },

    handleResult: function (message) {},

    handleTurn: function (message) {
        var deployList = message.deploy;
        for (var i = 0; i < deployList.length; ++i) {
            this.presentation.deploy(deployList[i]);
        }

        this.presentation.step(message.dt);
    }
});

module.exports = Battle;
