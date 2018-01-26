import BaseScene from "../common/baseScene";
import ui from "../utils/ui";

import config from "config";
import Localize from "../localize";
import { storeDispatch, getStoreState } from "../store/store";

import ObjectPool from "../common/objectPool";
import Battle from "../battle";

var InGameScene = BaseScene.extend({
    ctor: function() {
        this._super();

        var self = this;

        this.battle = new Battle();
        this.addChild(this.battle);
    },

    onEnter: function() {
        this._super();

        this.showWaiting(true);

        cc.log("Loading battle...");
        var self = this;
        loadResources(["battle.plist", "characters.plist"], () => {
            addSpriteFramesFromResource("battle.plist");
            addSpriteFramesFromResource("characters.plist");

            this.battle.init();
            this.battle.connect();

            this.scheduleUpdate();
            this.showWaiting(false);
        });
    },

    onExit: function() {
        this._super();

        this.unscheduleUpdate();

        removeSpriteFramesFromResource("battle.plist");
        removeSpriteFramesFromResource("characters.plist");
        this.battle.close();
    },

    update: function(dt) {
        this.battle.update(dt);
    },

    onAction: function(touch, event) {
        if (this.battle.isReady()) {
            // TODO
        }
    }
});

module.exports = InGameScene;
