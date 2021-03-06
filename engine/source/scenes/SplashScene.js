import BaseScene from "../common/baseScene";
import ui from "../utils/ui";

import Localize from "../localize";
import { storeDispatch, getStoreState } from "../store/store";
import { login } from "../reducer/authenticate";
import alertLayer from "../common/alertLayer";

var SplashSceneLayer = cc.Layer.extend({
    ctor: function() {
        this._super();
    }
});

var SplashScene = BaseScene.extend({
    ctor: function() {
        this._super({
            persitSprites:[
                "splash.plist",
                "ui.plist"
            ],
            sounds:[
                "bg_music",
                "click"
            ]
        });
    },
    onReady:function(){
        this._super();
        this.addChild(new SplashSceneLayer());

        setTimeout(function(){
            cc.director.runScene(new window.MenuScene())
        },500);
    }
});

module.exports = SplashScene;
