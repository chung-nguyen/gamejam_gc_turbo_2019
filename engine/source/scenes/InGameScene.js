import BaseScene from "../common/baseScene";
import ui from ".//utils/ui";

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

        this.touchpad = new ActionTouchpad({
            contentSize: this.getContentSize(),
            onAction: this.onAction.bind(this)
        });

        this.addChild(this.touchpad);
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
