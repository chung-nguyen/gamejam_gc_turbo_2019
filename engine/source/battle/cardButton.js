import ui from "../utils/ui";
import Defs from "./defs";

var CardButton = cc.Node.extend({
    ctor: function(opts) {
        this._super();

        var spr = new cc.Sprite();
        this.addChild(spr);
        this.sprite = spr;

        this.dummies = [];

        this.name = "";
        this.team = 0;
        this.index = 0;
        this.ref = 0;

        this.isSelected = false;
    },

    setCharacterName: function(name, team) {
        if (this.name !== name || this.team !== team) {
            this.name = name;
            this.team = team;

            this.sprite.setSpriteFrame(name + "_portrait.png");
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
        this.sprite.setPosition(cc.p(0, 0));
    },

    select: function() {
        this.isSelected = true;
        this.sprite.setPosition(cc.p(0, 20));

        for (var i = 0; i < this.dummies.length; ++i) {
            var dummy = this.dummies[i];
            dummy.setFacing(this.team === 0 ? 0 : 180);
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

    containsTouchLocation: function(touch) {
        var pt = touch.getLocation();
        var sz = this.sprite.getContentSize();
        var bb = cc.rect(0, 0, sz.width, sz.height);

        return cc.rectContainsPoint(bb, this.sprite.convertToNodeSpace(pt));
    }
});

module.exports = CardButton;
