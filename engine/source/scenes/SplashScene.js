import BaseScene from "../common/baseScene";
import ui from "../utils/ui";

import Localize from "../localize";
import { storeDispatch, getStoreState } from "../store/store";
import { login } from "../reducer/authenticate";

var SplashSceneLayer = cc.Layer.extend({
    ctor: function() {
        this._super();
        ui.makeImageView(this, { sprite: "background.jpg", resizeMode: ui.RESIZE_COVER });
    }
});

var SplashScene = BaseScene.extend({
    ctor: function() {
        this._super({
            persitSprites:[
                "splash.plist",
                "ui.plist"
            ]
        });
    },
    onReady:function(){
        this._super();
        this.addChild(new SplashSceneLayer());
        setTimeout(function(){
            cc.director.runScene(new window.MenuScene())
        },1000);
    }
});

module.exports = SplashScene;
