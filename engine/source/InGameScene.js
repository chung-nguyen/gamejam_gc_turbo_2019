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
                self.addChild(fish, 1);
                return fish;
            },
            onShow: function() {
                this.setVisible(true);
            },
            onHide: function() {
                this.stopAllActions();
                this.setVisible(false);
            },
            onDestroy: function() {
                this.removeFromParent(true);
            }
        });
        this.hookPool = new ObjectPool({
            onCreate: function() {
                var hook = new Hook();
                self.addChild(hook, 10);
                return hook;
            },
            onShow: function() {
                this.setVisible(true);
            },
            onHide: function() {
                this.stopAllActions();
                this.setVisible(false);
            },
            onDestroy: function() {
                this.removeFromParent(true);
            }
        });

        this.touchpad = new ActionTouchpad({
            contentSize: this.getContentSize(),
            onAction: this.onAction.bind(this)
        });

        this.addChild(this.touchpad);
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

        var self = this;
        loadResources(["fishes.plist", "hooks.plist"], () => {
            addSpriteFramesFromResource("fishes.plist");
            addSpriteFramesFromResource("hooks.plist");

            this.scheduleUpdate();
            this.showWaiting(false);

            this.willAction = false;
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

            if (this.willAction) {
                this.gameLogic.sendCommand({
                    type: GameLogic.ACTION
                });

                this.willAction = false;
            }

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

                fish.setScale(logicFish.getDisplayDirection(), 1);
                fish.setPosition(logicFish.getDisplayPosition());
                fish.playAnimation("swim");
                this.fishes[logicFish.id] = fish;
            } else {
                var logicCurrentPosition = logicFish.getDisplayPosition();
                var logicFuturePosition = logicFish.getDisplayFuturePosition();
                var dt = this.timeCounter / config.fixedTimeStep;

                var p = cc.p(cc.lerp(logicCurrentPosition.x, logicFuturePosition.x, dt), cc.lerp(logicCurrentPosition.y, logicFuturePosition.y, dt));

                fish.setPosition(p);

                if (logicFish.caughtHook && !fish.isCaught) {
                    fish.setPotPosition(logicFish.caughtHook.getDisplayPosition(), logicFish.caughtHook.getDisplayPotPosition());
                }
            }

            fish.updateCounter = this.updateCounter;
        }

        for (var fishID in this.fishes) {
            var fish = this.fishes[fishID];
            if (fish.updateCounter < this.updateCounter) {
                delete this.fishes[fishID];

                if (fish.isCaught) {
                    // this fish is dead in logic, but animate the going into pot animation before deletion
                    fish.goIntoPot((target) => {
                        this.fishPool.push(target);
                    });
                } else {
                    this.fishPool.push(fish);
                }
            }
        }
    },

    onAction: function(touch, event) {
        this.willAction = true;
    }
});

var ActionTouchpad = cc.Node.extend({
    ctor: function(opts) {
        this._super();

        this.setContentSize(opts.contentSize);

        this.onAction = opts.onAction;
    },

    onEnter: function() {
        this._super();

        var self = this;
        this._touchListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: self.onTouchBegan.bind(self),
            onTouchMoved: self.onTouchMoved.bind(self),
            onTouchEnded: self.onTouchEnded.bind(self),
            onTouchCancelled: self.onTouchCancelled(self)
        });

        cc.eventManager.addListener(self._touchListener, self);
    },

    onExit: function() {
        this._super();
        cc.eventManager.removeListener(this._touchListener);
    },

    onTouchBegan: function(touch, event) {
        return true;
    },

    onTouchMoved: function(touch, event) {
        return true;
    },

    onTouchEnded: function(touch, event) {
        this.onAction && this.onAction(touch, event);
        return true;
    },

    onTouchCancelled: function(touches, event) {
        return false;
    }
});

module.exports = InGameScene;
