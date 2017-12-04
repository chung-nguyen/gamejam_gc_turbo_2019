import AvatarCache from "./common/avatarCache";
import BaseScene from "./common/baseScene";
import ui from "./utils/ui";

import config from "config";
import Localize from "./localize";
import { storeDispatch, getStoreState } from "./store/store";

import ObjectPool from "./common/objectPool";
import Fish from "./entity/fish";
import Hook from "./entity/hook";
import GameLogic from "./logic/gameLogic";

var InGameScene = BaseScene.extend({
    ctor: function() {
        this._super();

        this.timeCounter = 0;
        this.updateCounter = 0;
        this.fishes = {};
        this.hooks = {};

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
                this.removeFromParent(true);
            }
        });
        this.hookPool = new ObjectPool({
            onCreate: function() {
                var hook = new Hook();
                self.addChild(hook);
                return hook;
            },
            onShow: function() {
                this.setVisible(true);
            },
            onHide: function() {
                this.setVisible(false);
            },
            onDestroy: function() {
                this.removeFromParent(true);
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
        loadResources(["fishes.plist", "hooks.plist"], () => {
            addSpriteFramesFromResource("fishes.plist");
            addSpriteFramesFromResource("hooks.plist");

            this.scheduleUpdate();
            this.showWaiting(false);
        });
    },

    onExit: function() {
        this._super();

        this.unscheduleUpdate();
        this.fishPool.clear();
        this.hookPool.clear();

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
        this.updateFishes(entities.fishes);
        this.updateHooks(entities.hooks);
    },

    updateHooks: function(hooks) {
        for (var i = 0; i < hooks.length; ++i) {
            var logicHook = hooks[i];
            var hook = this.hooks[logicHook.id];

            if (!hook) {
                hook = this.hookPool.pop();
                hook.reset();

                hook.setPosition(logicHook.getDisplayPosition());
                hook.setDirection(logicHook.getDisplayAngle(), logicHook.getDisplayLength());
                this.hooks[logicHook.id] = hook;
            } else {
                var dt = this.timeCounter / config.fixedTimeStep;

                var logicCurrentAngle = logicHook.getDisplayAngle();
                var logicFutureAngle = logicHook.getDisplayFutureAngle();
                var a = cc.lerp(logicCurrentAngle, logicFutureAngle, dt);

                var logicCurrentLength = logicHook.getDisplayLength();
                var logicFutureLength = logicHook.getDisplayFutureLength();
                var l = cc.lerp(logicCurrentLength, logicFutureLength, dt);

                hook.setDirection(a, l);
            }
        }

        for (var hookID in this.hooks) {
            var hook = this.hooks[hookID];
            if (hook.updateCounter < this.updateCounter) {
                this.hookPool.push(fish);
                delete this.hooks[hookID];
            }
        }
    },

    updateFishes: function(fishes) {
        for (var i = 0; i < fishes.length; ++i) {
            var logicFish = fishes[i];
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
                var dt = this.timeCounter / config.fixedTimeStep;

                var p = cc.p(
                    cc.lerp(logicCurrentPosition.x, logicFuturePosition.x, dt),
                    cc.lerp(logicCurrentPosition.y, logicFuturePosition.y, dt)
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
