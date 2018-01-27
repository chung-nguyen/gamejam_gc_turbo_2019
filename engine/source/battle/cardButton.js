import ui from "../utils/ui";
import Defs from "./defs";

var CardButton = cc.Node.extend({
    ctor: function(opts) {
        this._super();

        

        this.dummies = [];

        this.name = "";
        this.team = 0;
        this.index = 0;
        this.ref = 0;

        this.frame = ui.makeImageView(this, {
            sprite: "popup_frame.png",
            scale9Size: cc.size(Defs.ACTION_BAR_HEIGHT*0.75, Defs.ACTION_BAR_HEIGHT*0.75),
            anchorPoint: cc.p(0, 0),
            position: ui.relativeTo(this, ui.CENTER, 0, 0),
            ignoreContentAdaptWithSize: false
        });

        var spr = new cc.Sprite();
        this.sprite = spr;
        this.frame.addChild(spr);
        
        

        this.isSelected = false;
    },

    setCharacterName: function(name, team) {
        if (this.name !== name || this.team !== team) {
            this.name = name;
            this.team = team;
            this.sprite.setSpriteFrame(name + "_portrait.png");
            this.sprite.setScaleX(-1);
            this.sprite.setAnchorPoint(cc.p(0.5, 0.5));
            this.sprite.setPosition(ui.relativeTo(this.frame, ui.CENTER_BOTTOM, 0, 20));
            this.createAnimAction();
            
        }
    },



    removeDummies: function () {
        for (var i = 0; i < this.dummies.length; ++i) {
            var dummy = this.dummies[i];
            dummy.cleanUp();
        }

        this.dummies.length = 0;
    },

    setDummies: function(dummies) {
        this.removeDummies();

        this.dummies = dummies;
        for (var i = 0; i < this.dummies.length; ++i) {
            var dummy = this.dummies[i];
            dummy.setVisible(false);
        }
        
    },

    unselect: function() {
        this.isSelected = false;
        this.sprite.stopAllActions();
    },

    select: function() {
        this.isSelected = true;
        this.sprite.runAction(this.animAction);
        for (var i = 0; i < this.dummies.length; ++i) {
            var dummy = this.dummies[i];
            dummy.setFacing(this.team === 0 ? 1 : -1);
        }
    },

    moveAt: function(touch) {
        for (var i = 0; i < this.dummies.length; ++i) {
            var dummy = this.dummies[i];
            var pt = touch.getLocation();
            var pos = dummy.getParent().convertToNodeSpace(pt);
            pos.x += dummy.offsetX * 0.01 * Defs.ARENA_CELL_WIDTH;
            pos.y += dummy.offsetY * 0.01 * Defs.ARENA_CELL_HEIGHT;
            dummy.setPosition(pos);
            dummy.setVisible(true);
        }
    },

    throwAt: function(touch) {
        this.sprite.setVisible(false);
    },

    hideDummies: function() {
        for (var i = 0; i < this.dummies.length; ++i) {
            var dummy = this.dummies[i];
            dummy.setVisible(false);
        }
    },

    clearDummies: function () {
        for (var i = 0; i < this.dummies.length; ++i) {
            var dummy = this.dummies[i];
            dummy.removeFromParent();
        }
        this.dummies = [];
    },

    containsTouchLocation: function(touch) {
        var pt = touch.getLocation();
        var sz = this.frame.getContentSize();
        var bb = cc.rect(0, 0, sz.width, sz.height);
        return cc.rectContainsPoint(bb, this.frame.convertToNodeSpace(pt));
    },
    createAnimAction: function () {
        var animationName = Defs.UNIT_DATA[this.name].animation.attack.name;
        var i = 0;
        var animFrames = [];
        var frame = cc.spriteFrameCache.getSpriteFrame(animationName + "_" + i + ".png");
        while(frame)
        {
            animFrames.push(frame);
            i++;
            frame = cc.spriteFrameCache.getSpriteFrame(animationName + "_" + i + ".png");
        }
        this.animAction = new cc.Animation(animFrames, 1.0 / Defs.ANIMATION_FPS);
        this.animAction = new cc.RepeatForever(new cc.Animate(this.animAction));
        return this.animAction;
    },
    update: function (dt) {
        this._super(dt);
    }
});

module.exports = CardButton;
