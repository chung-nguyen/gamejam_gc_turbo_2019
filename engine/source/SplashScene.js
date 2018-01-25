import BaseScene from "./common/baseScene";
import ui from "./utils/ui";

import Localize from "./localize";
import { storeDispatch, getStoreState } from "./store/store";
import { login } from "./reducer/authenticate";

var SplashSceneLayer = cc.Layer.extend({
    ctor: function() {
        this._super();

        ui.makeImageView(this, { sprite: "background.jpg", resizeMode: ui.RESIZE_COVER });

        var btnInstantPlay = ui.makeButton(this, {
            normal: "button_green.png",
            pressed: "button_green_pressed.png",
            anchorPoint: cc.p(0.5, 0),
            position: ui.relativeTo(this, ui.CENTER_BOTTOM, 0, 10),
            listener: this.onInstantPlay,
            listenerTarget: this
        });

        ui.makeText(btnInstantPlay, {
            text: Localize.getCaps("instantPlay"),
            font: getBigFontName(),
            fontSize: 40,
            position: ui.relativeTo(btnInstantPlay, ui.CENTER, 0, 0),
            shadow: true
        });
    },

    onInstantPlay: function(sender, type) {
        if (type === ccui.Widget.TOUCH_ENDED) {
            setImmediate(() => {
                var authenticate = getStoreState().authenticate;
                var userId = authenticate.id || Math.random().toString(36).substr(2, 9);

                storeDispatch(login({ id: userId }, () => {
                    cc.director.runScene(new window.LoadingScene())
                }));
            });
        }
    }
});

var SplashScene = BaseScene.extend({
    ctor: function() {
        this._super();
    },

    onEnter: function() {
        this._super();

        this.showWaiting(true);
        loadResources(["splash.plist"], () => {
            addSpriteFramesFromResource("splash.plist");
            this.addChild(new SplashSceneLayer());

            this.showWaiting(false);
        });
    }
});

module.exports = SplashScene;
