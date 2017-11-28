import AvatarCache from "./common/avatarCache";
import BaseScene from "./common/baseScene";
import ui from "./utils/ui";

import config from "config";
import Localize from "./localize";
import { storeDispatch, getStoreState } from "./store/store";

import ObjectPool from "./common/objectPool";
import Fish from "./entity/fish";
import GameLogic from "./logic/gameLogic";

var InGameScene = BaseScene.extend({
    ctor: function() {
        this._super();

        this.timeCounter = 0;
        this.updateCounter = 0;
        this.fishes = {};

        var self = this;
        this.fishPool = new ObjectPool({
            onCreate: function() {
                var fish = new Fish();
                self.addChild(fish);
                return fish;
            },
            onShow: function() {
                this.setVisible(true);
            },
            onHide: function() {
                this.setVisible(false);
            },
            onDestroy: function() {
                this.removeFromParent();
            }
        });
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

    update: function(dt) {
        ++this.updateCounter;

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
                fish = this.fishPool.pop();
                fish.reset(fishData);

                fish.setPosition(logicFish.getDisplayPosition());
                fish.runAction("swim");
                this.fishes[logicFish.id] = fish;
            } else {
                var logicCurrentPosition = logicFish.getDisplayPosition();
                var logicFuturePosition = logicFish.getDisplayFuturePosition();

                var p = cc.p(
                    cc.lerp(logicCurrentPosition.x, logicFuturePosition.x, this.timeCounter / config.fixedTimeStep),
                    cc.lerp(logicCurrentPosition.y, logicFuturePosition.y, this.timeCounter / config.fixedTimeStep)
                );

                fish.setPosition(p);
            }

            fish.updateCounter = this.updateCounter;
        }

        for (var fishID in this.fishes) {
            var fish = this.fishes[fishID];
            if (fish.updateCounter < this.updateCounter) {
                this.fishPool.push(fish);
                delete this.fishes[fishID];
            }
        }
    }
});

module.exports = InGameScene;
