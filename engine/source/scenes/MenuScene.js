import BaseScene from "../common/baseScene";
import ui from "../utils/ui";

import Localize from "../localize";
import { storeDispatch, getStoreState } from "../store/store";
import { login } from "../reducer/authenticate";

var MenuSceneLayer = cc.Layer.extend({
    ctor: function () {
        this._super();
        ui.makeImageView(this, { sprite: "logo.png", position: ui.relativeTo(this, ui.TOP_CENTER, 320, 200) });
        this.initUI();
    },
    initUI: function () {
        let instantPlay = this.addButton("instantPlay", this.onInstantPlay, {
            position: ui.relativeTo(this, ui.CENTER, 0, 0)
        });
        // let option = this.addButton("option", this.onEnterOption, {
        //     position: ui.relativeTo(this, ui.LEFT_MIDDLE, 30, -50)
        // });
        // let help = this.addButton("help", this.onInstantPlay, {
        //     position: ui.relativeTo(this, ui.LEFT_MIDDLE, 30, -200)
        // });
        // let about = this.addButton("about", this.onInstantPlay, {
        //     position: ui.relativeTo(this, ui.LEFT_MIDDLE, 30, -350)
        // });
    },
    addButton: function (text, handle, opt) {
        opt = Object.assign({
            normal: "button_green.png",
            pressed: "button_green_pressed.png",
            anchorPoint: cc.p(0.5, 0.5),
            position: ui.relativeTo(this, ui.LEFT_MIDDLE, 30, 30),
            listener: handle,
            listenerTarget: this,
            scale: 2
        }, opt || {});

        var button = ui.makeButton(this, opt);
        ui.makeText(button, {
            text: Localize.getCaps(text),
            font: getBigFontName(),
            fontSize: 32,
            position: ui.relativeTo(button, ui.CENTER, 0, 0),
            shadow: true
        });
        return button;
    },
    onInstantPlay: function (sender, type) {
        if (type === ccui.Widget.TOUCH_ENDED) {
            setImmediate(() => {
                Sound.playSfx("click");
                Sound.stopMusic();
                var authenticate = getStoreState().authenticate;
                var userId = authenticate.id || Math.random().toString(36).substr(2, 9);
                storeDispatch(login({ id: userId }, () => {
                    cc.director.runScene(new window.LoadingScene())
                }));
            });
        }
    },
    onEnterOption: function (sender, type)
    {
        if (type === ccui.Widget.TOUCH_ENDED) {
            Sound.playSfx("click");
            setImmediate(() => {

            });
        }
    }
});

var MenuScene = BaseScene.extend({
    ctor: function () {
        this._super();
    },
    onEnter: function () {
        this._super();
        this.addChild(new MenuSceneLayer());
    },
    onReady:function()
    {
        this._super();
        Sound.playMusic("bg_music",true);
    }
});

module.exports = MenuScene;
