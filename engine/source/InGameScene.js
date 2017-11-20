import AvatarCache from "./common/avatarCache";
import BaseScene from "./common/baseScene";
import ui from "./utils/ui";

import config from "config";
import Localize from "./localize";
import { storeDispatch, getStoreState } from "./store/store";
import Fish from "./entity/fish";
import GameLogic from "./logic/gameLogic";

var InGameScene = BaseScene.extend({
    ctor: function() {
        this._super();
    },

    onEnter: function() {
        this._super();

        this.gameLogic = new GameLogic({
            level: getStoreState().levelDesign.levels[0]
        });
        
        this.showWaiting(true);
        loadResources(["fishes.plist"], () => {
            addSpriteFramesFromResource("fishes.plist");
            
            this.scheduleUpdate();
            this.showWaiting(false);
        });
    },

    onExit: function() {
        this._super();

        this.unscheduleUpdate();
        removeSpriteFramesFromResource("fishes.plist");
    },

    update: function (dt) {

        this.gameLogic.step(config.fixedTimeStep);
    }
});

module.exports = InGameScene;
