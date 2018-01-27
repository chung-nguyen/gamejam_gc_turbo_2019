import SocketClient from "../common/socketClient";
import { getStoreState } from "../store/store";
import Defs from "./defs";

import Camera from "./camera";
import Presentation from "./presentation";
import ActionBar from "./actionBar";
import ActionTouchpad from "./actionTouchpad";
import ui from "../utils/ui";
import shuffle from "../utils/shuffle";

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
        this.currentTurn = 0;
        this.receivedTurnCount = 0;
        this.replay = {};
        this.isLagged = false;
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

        this.actionBar = new ActionBar({ maxEnergy: 10, battleRoot: this.presentation.root, socket: this.socket, team: room.playerId });
        this.actionBar.setAnchorPoint(0, 0);
        this.actionBar.setPosition(ui.relativeTo(this, ui.LEFT_BOTTOM, 0, 0));
        this.addChild(this.actionBar, 40);

        var touchpad = new ActionTouchpad({
            contentSize: cc.size(Defs.SCREEN_SIZE.width, Defs.SCREEN_SIZE.height),
            actionBar: this.actionBar,
            battleRoot: this.presentation.root,
            team: room.playerId
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
        if (this.state === State.GAMEOVER) {
            return this.updateGameOver(dt);
        }

        if (this.state === State.LOADING && this.socket.isReady) {
            this.send({ type: "ready" });
            this.state = State.WAITING;
        }

        this.actionBar.update(dt);

        var message = this.socket.popMessage();
        if (message) {
            switch (message.type) {
                case "ready":
                    this.handleReady(message);
                    break;

                case "timeOver":
                    this.handleTimeOver(message);
                    break;

                case "turn":
                    this.handleTurn(message);
                    break;

                case "lagged":
                    this.showLaggedWarning();
                    this.isLagged = true;
                    break;
            }
        }

        if (!this.isLagged) {
            this.presentation.update(dt);
        }
    },

    showLaggedWarning: function () {
        // TODO
    },

    hideLaggedWarning: function () {
        // TODO
    },

    initGameOver: function (result) {
        this.state = State.GAMEOVER;

        // TODO
    },

    updateGameOver: function (dt) {
        // TODO
        cc.director.runScene(new window.SplashScene());
    },

    handleReady: function (message) {
        cc.log("Battle ready!");
        this.state = State.RUNNING;

        var room = getStoreState().room;

        //var hand = ["raider", "gunner", "giant", "axeman", "flamer", "sawman"];
        var hand = ["gunner", "gunner", "gunner", "gunner", "gunner"];
        shuffle(hand);
        this.actionBar.setHand(hand);

        this.actionBar.setVisible(true);
        this.touchpad.setVisible(true);

        this.presentation.init();
    },

    handleTimeOver: function (message) {
        this.initGameOver({ winnerId: -1 });
    },

    handleTurn: function (message) {
        if (this.state !== State.RUNNING) return;

        this.replay[message.index] = message;
        if (message.index > this.receivedTurnCount) {
            this.receivedTurnCount = message.index;
        }

        var turn = this.replay[this.currentTurn];
        if (turn && this.receivedTurnCount - this.currentTurn >= Defs.TURN_PADDING) {
            this.hideLaggedWarning();
            this.isLagged = false;

            var deployList = turn.deploy;
            for (var i = 0; i < deployList.length; ++i) {
                var deployment = deployList[i];
                this.actionBar.recycleCardButton(deployment.ref);
                this.presentation.deploy(deployment);
            }

            this.presentation.step(turn.dt);
            this.actionBar.setEnergy(this.presentation.energy);
            ++this.currentTurn;

            if (this.presentation.result) {
                this.initGameOver(this.presentation.result);
            } else {
                this.send({ type: "ack", turn: this.currentTurn });
            }
        }
    }
});

module.exports = Battle;
