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

        this.timeCounter = 0;
        this.fishes = {};
    },

    onEnter: function() {
        this._super();

        this.gameLogic = new GameLogic({
            level: getStoreState().levelDesign.levels[0],
            bounds: {
                left: 0,
                right: this.getContentSize().width
            }
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
        this.timeCounter += dt * 1000;
        if (this.timeCounter >= config.fixedTimeStep) {
            this.timeCounter -= config.fixedTimeStep;
            this.gameLogic.step(config.fixedTimeStep);
        }

        var entities = this.gameLogic.getEntities();
        for (var i = 0; i < entities.fishes.length; ++i) {            
            var logicFish = entities.fishes[i];
            var fish = this.fishes[logicFish.id];

            if (!fish) {
                var fishData = this.gameLogic.getFishData(logicFish.type);
                fish = new Fish({
                    name: "fish1",
                    scale: 0.4,
                    swim: { alias: "swim", frameCount: 13, fps: 30 },
                    bite: { alias: "swim", frameCount: 13, fps: 30 },
                    sway: { alias: "swim", frameCount: 13, fps: 30 }
                });                

                fish.setPosition(cc.p(logicFish.x * 0.1, logicFish.y));
                this.fishes[logicFish.id] = fish;
                this.addChild(fish);                
            } else {
                fish.setPosition(cc.p(logicFish.x * 0.1, logicFish.y));
            }
        }
    }
});

module.exports = InGameScene;
