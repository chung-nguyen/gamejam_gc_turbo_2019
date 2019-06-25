import Defs from "./defs";

var ActionTouchpad = cc.Node.extend({
    ctor: function(opts) {
        this._super();

        this.setContentSize(opts.contentSize);
        this.setAnchorPoint(opts.anchorPoint || cc.p(0, 0));
        this.battleRoot = opts.battleRoot;

        this._opts = opts;
        this.actionBar = opts.actionBar;
        this.selectedCard = null;
        this.team = opts.team;
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

    setArenaSize: function(width, height) {
        var sz = this.getContentSize();

        this.arenaSize = cc.size(width, height);
        this.arenaViewSize = cc.size(
            width * Defs.ARENA_CELL_WIDTH * Defs.BATTLE_SCALE,
            height * Defs.ARENA_CELL_HEIGHT * Defs.BATTLE_SCALE
        );
        this.arenaOrigin = cc.p(
            (sz.width - this.arenaViewSize.width) * 0.5 + Defs.BATTLE_POSITION.x,
            (sz.height - this.arenaViewSize.height) * 0.5 + Defs.BATTLE_POSITION.y
        );
        this.arenaFullSide = cc.rect(this.arenaOrigin.x, this.arenaOrigin.y, this.arenaViewSize.width, this.arenaViewSize.height);
        this.arenaAllySide = cc.rect(
            this.arenaOrigin.x,
            this.arenaOrigin.y,
            this.arenaViewSize.width,
            this.arenaViewSize.height / 2 - Defs.ARENA_CELL_HEIGHT * 2
        );
        this.arenaEnemySide = cc.rect(
            this.arenaOrigin.x,
            this.arenaOrigin.y + this.arenaViewSize.height / 2 + Defs.ARENA_CELL_HEIGHT * 2,
            this.arenaViewSize.width,
            this.arenaViewSize.height / 2 - Defs.ARENA_CELL_HEIGHT * 2
        );
    },

    onTouchBegan: function(touch, event) {
        if (!this._containsTouchLocation(touch)) {
            return false;
        } else {
            var card = this.actionBar.getSelectedCardByTouch(touch);
            if (card) {
                if (this.selectedCard !== card) {
                    if (this.selectedCard) {
                        this.selectedCard.unselect();
                    }

                    this.selectedCard = card;
                    this.selectedCard.select();
                } else {
                    this.selectedCard.unselect();
                    this.selectedCard = null;
                }
            }

            if (this.selectedCard) {
                if (this.isDeployableAt(this.selectedCard, touch)) {
                    this.selectedCard.moveAt(touch);
                } else {
                    this.selectedCard.hideDummies();
                }
            }

            return true;
        }
    },

    onTouchMoved: function(touch, event) {
        if (this.selectedCard) {
            if (this.isDeployableAt(this.selectedCard, touch)) {
                this.selectedCard.moveAt(touch);
            } else {
                this.selectedCard.hideDummies();
            }
        } else {
            var card = this.actionBar.getSelectedCardByTouch(touch);
            if (card) {
                this.selectedCard = card;
                this.selectedCard.select();
            }
        }
    },

    onTouchEnded: function(touch, event) {
        if (this.selectedCard) {
            cc.log("ENEDDED");
            if (this.isDeployableAt(this.selectedCard, touch)) {
                cc.log("DEPLOY");
                this.actionBar.throwCardAt(this.selectedCard, touch);
                this.selectedCard = null;
            } else {
                cc.log("WILL NOT DEPLOY");
                this.selectedCard.hideDummies();
            }
        }
    },

    onTouchCancelled: function(touches, event) {
        if (this.selectedCard) {
            this.selectedCard = null;
        }
    },

    isDeployableAt: function(card, touch) {
        var pt = this.convertToNodeSpace(touch.getLocation());
        pt = this.battleRoot.convertToNodeSpace(pt);

        var x = pt.x / Defs.ARENA_CELL_WIDTH;
        var y = pt.y / Defs.ARENA_CELL_HEIGHT;

        var xCond;
        if (this.team === 0) {
            xCond = y >= 0 && y < 15;
        } else {
            xCond = y > 17 && y < 32;
        }

        return xCond && (y >= 0 && y < 18);
    },

    _containsTouchLocation: function(touch) {
        var pt = touch.getLocation();
        var sz = this.getContentSize();
        var bb = cc.rect(0, 0, sz.width, sz.height);
        return cc.rectContainsPoint(bb, this.convertToNodeSpace(pt));
    }
});

module.exports = ActionTouchpad;
