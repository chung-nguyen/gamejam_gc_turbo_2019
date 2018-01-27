import BaseScene from "../common/baseScene";
import ui from "../utils/ui";

import config from "config";
import Localize from "../localize";
import { storeDispatch, getStoreState } from "../store/store";

import ObjectPool from "../common/objectPool";
import Battle from "../battle";

var InGameScene = BaseScene.extend({
    ctor: function () {
        this._super({
            sprites: ["battle.plist", "characters.plist"] 
        });
    },
    onEnter: function () {
        this._super();
    },
    onLoading: function () {
        this._super();
        cc.log("Loading battle...");
    },
    onReady: function () {
        this._super();
        cc.log("Resource ready");
        this.battle = new Battle();
        
        this.addChild(this.battle);
        this.battle.init();
        this.battle.connect();
        this.scheduleUpdate();
    },
    onExit: function () {
        this._super();
        this.unscheduleUpdate();
        this.battle.close();
    },

    update: function (dt) {
        this.battle.update(dt);
    },

    onAction: function (touch, event) {
        if (this.battle.isReady()) {
            // TODO
        }
    }
});

module.exports = InGameScene;
