import SocketClient from "../common/socketClient";
import { getStoreState } from "../store/store";
import Defs from "./defs";

import Camera from "./camera";
import Presentation from "./presentation";
import ActionBar from "./actionBar";
import ui from "../utils/ui";
import shuffle from "../utils/shuffle";
import alertLayer from "../common/alertLayer";
import NotifyLayer from "../common/notifyLayer";
import TopBar from "./topBar";

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

    onOpenActionBar: function (sender, type) {
        if (type === ccui.Widget.TOUCH_ENDED) {
            this.actionBar.setVisible(!this.actionBar.isVisible());
        }
    },

    init: function () {
        var room = getStoreState().room;

        this.ground = new cc.Sprite("#ground.png");
        this.ground.setPosition(
            cc.p(Defs.SCREEN_CENTER.x + Defs.BATTLE_POSITION.x, Defs.SCREEN_CENTER.y + Defs.BATTLE_POSITION.y)
        );
        this.ground.setScale(Defs.BATTLE_SCALE);
        this.addChild(this.ground);

        this.openButton = ui.makeButton(this, {
            normal: "blue_button.png",
            pressed: "blue_button.png",
            anchorPoint: cc.p(1, 0),
            listener: this.onOpenActionBar,
            listenerTarget: this,
            scale: 1.5,
            position: ui.relativeTo(this, ui.RIGHT_BOTTOM, 5, 5)
        });

        ui.makeImageView(this.openButton, {
            sprite: "badge_cyber.png",
            anchorPoint: cc.p(0.5, 0.5),
            scale: 0.5,
            position: ui.relativeTo(this.openButton, ui.CENTER, 0, 0)
        });

        this.actionBar = new ActionBar({
            socket: this.socket,
            team: room.playerId
        });
        this.actionBar.setAnchorPoint(0, 0);
        this.actionBar.setPosition(ui.relativeTo(this, ui.LEFT_BOTTOM, 0, 0));
        this.addChild(this.actionBar, 40);

        var topBar = new TopBar({});

        topBar.setAnchorPoint(0, 0);
        topBar.setPosition(ui.relativeTo(this, ui.LEFT_TOP, 0, 0));
        this.addChild(topBar, 60);
        this.topBar = topBar;

        this.actionBar.setVisible(false);

        var groundSize = this.ground.getContentSize();
        this.presentation = new Presentation({ team: room.playerId, actionBar: this.actionBar });
        this.presentation.setPosition(groundSize.width / 2, groundSize.height / 2);
        this.ground.addChild(this.presentation, 10);

        Camera.setRotate(room.playerId === 0 ? 0 : 180);
        this.presentation.rotate(Camera.rotate);

        this.lagNotify = new NotifyLayer();
        this.lagNotify.setText("Reconnecting...");
        this.lagNotify.setVisible(false);
        this.addChild(this.lagNotify);

        this.battleResult = new alertLayer();
        this.battleResult.setVisible(false);
        this.addChild(this.battleResult, 100);
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
        if (this.state === State.GAMEOVER) return;

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
        this.lagNotify.setVisible(true);
    },

    hideLaggedWarning: function () {
        this.lagNotify.setVisible(false);
    },

    initGameOver: function (result) {
        this.battleResult.setError(
            result.winnerId == getStoreState().room.playerId ? "YOU WIN!" : result.winnerId < 0 ? "DRAW!" : "YOU LOSE!",
            (_) => {
                cc.director.runScene(new window.SplashScene());
            }
        );
        this.battleResult.setVisible(true);
        this.state = State.GAMEOVER;
    },
    handleReady: function (message) {
        cc.log("Battle ready!");
        this.state = State.RUNNING;

        var room = getStoreState().room;

        var hand = [ "001", "002", "003", "004", "005", "006" ];
        this.actionBar.setHand(hand);

        this.actionBar.setVisible(false);

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
                this.presentation.deploy(deployment);
            }

            this.presentation.step(turn.dt);
            this.topBar.setInfo(this.presentation.gold, this.presentation.time);
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
