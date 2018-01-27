import BaseScene from "../common/baseScene";
import ui from "../utils/ui";

import Localize from "../localize";
import { storeDispatch, getStoreState } from "../store/store";
import { startBattle } from "../reducer/room";

var LoadingSceneLayer = cc.Layer.extend({
    ctor: function () {
        this._super();
    }
});

var LoadingScene = BaseScene.extend({
    ctor: function () {
        this._super({
            sprites: [ "splash.plist" ]
        });
    },

    onReady: function () {
        this._super();
        this.addChild(new LoadingSceneLayer());
        var authenticate = getStoreState().authenticate;
        storeDispatch(
            startBattle(authenticate, (result) => {
                if (result.error) {
                    console.error(result.error);
                    cc.director.runScene(new window.SplashScene());
                } else {
                    cc.director.runScene(new window.InGameScene());
                }
            })
        );
    }
});

module.exports = LoadingScene;
