import AvatarCache from "./common/avatarCache";
import BaseScene from "./common/baseScene";
import ui from "./utils/ui";

import Localize from "./localize";
import { storeDispatch } from "./store/store";
import { fetchLevelDesign } from "./reducer/levelDesign";

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
            setImmediate(() => cc.director.runScene(new window.InGameScene()));
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

            storeDispatch(fetchLevelDesign((action, state) => {
                this.showWaiting(false);
            }));            
        });
    },

    onExit: function() {
        this._super();

        removeSpriteFramesFromResource("splash.plist");
    }
});

module.exports = SplashScene;
