import BaseScene from "../common/baseScene";
import ui from "../utils/ui";

import Localize from "../localize";
import { storeDispatch, getStoreState } from "../store/store";
import { startBattle } from "../reducer/room";

var LoadingSceneLayer = cc.Layer.extend({
    ctor: function() {
        this._super();
    }
});

var LoadingScene = BaseScene.extend({
    ctor: function() {
        this._super();
    },

    onEnter: function() {
        this._super();

        this.showWaiting(true);
        this.addChild(new LoadingSceneLayer());

        var authenticate = getStoreState().authenticate;
        storeDispatch(startBattle(authenticate, () => {
            this.showWaiting(false);
            cc.director.runScene(new window.InGameScene())
        }));
    },

    onExit: function() {
        this._super();

        removeSpriteFramesFromResource("splash.plist");
    }
});

module.exports = LoadingScene;
