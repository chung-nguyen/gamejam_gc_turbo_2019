import ui from "../utils/ui";

import ObjectPool from "../common/objectPool";

import Defs from "./defs";
import EnergyBar from "./energyBar";
import CardButton from "./cardButton";

import DummyEntity from "./dummyEntity";

var ActionBar = cc.Node.extend({
    ctor: function (opts) {
        this._super();

        this.battleRoot = opts.battleRoot;
        this.socket = opts.socket;

        var panel = ui.makeImageView(this, {
            sprite: "action_bar_panel.png",
            scale9Size: cc.size(Defs.SCREEN_SIZE.width, Defs.SCREEN_SIZE.height / 3),
            anchorPoint: cc.p(0, 0),
            position: ui.relativeTo(this, ui.LEFT_BOTTOM, 0, 0),
            ignoreContentAdaptWithSize: false
        });

        this.panel = panel;
        this.team = opts.team;
        this.energy = 0;

      
        this._opts = opts;
        this.cardButtons = [];
        this.hand = [];
        this.handIndex = 0;

        this.cardButtonsPool = new ObjectPool({
            onCreate: function () {
                return new CardButton();
            },
            onHide: function () {
                this.clearDummies();
                this.setVisible(false);
            },
            onShow: function () {
                this.setVisible(true);
                this.sprite.setVisible(true);
                this.unselect();
            },
            onDestroy: function () {
                this.clearDummies();
                this.removeFromParent();
            }
        });

        this.pendingButtons = [];
        this.refCounter = 0;
        this.myPlayerIndex = -1;
    },

    setHand: function (hand) {
        this.clearCardButtons();

        this.cardButtons = [];
        for (var i = 0; i < Defs.MAX_CARDS_PER_ROUND; ++i) {
            this.cardButtons[i] = null;
        }

        this.hand = hand;
        for (var i = 0; i < Defs.MAX_CARDS_PER_ROUND; ++i) {
            var name = hand[i];
            this.setCard(i, name);
        }

        this.handIndex = i;
    },

    setCard: function (i, name) {
        
    },

    clearCardButtons: function () {
        for (var i = 0; i < this.cardButtons.length; ++i) {
            var button = this.cardButtons[i];
            this.cardButtonsPool.push(button);
            this.cardButtons[i] = null;
        }
    },

    getSelectedCardByTouch: function (touch) {
        for (var i = 0; i < this.cardButtons.length; ++i) {
            var button = this.cardButtons[i];
            if (button && button.isVisible() && button.containsTouchLocation(touch)) {
                var data = Defs.UNIT_DATA[button.name];
                if (data && data.Cost * 1000 <= this.energy) {
                    return button;
                }
            }
        }

        return null;
    },

    throwCardAt: function (card, touch) {
        for (var i = 0; i < this.cardButtons.length; ++i) {
            if (this.cardButtons[i] === card) {
                this.cardButtons[i] = null;
                break;
            }
        }

        ++this.refCounter;
        card.ref = this.refCounter;
        card.throwAt(touch);
        this.pendingButtons.push(card);

        var pt = this.convertToNodeSpace(touch.getLocation());
        pt = this.battleRoot.convertToNodeSpace(pt);

        var x = Math.floor(pt.x * 100 / Defs.ARENA_CELL_WIDTH);
        var y = Math.floor(pt.y * 100 / Defs.ARENA_CELL_HEIGHT);

        this.socket.send({ x, y, type: "deploy", name: card.name, ref: card.ref });
    },

    recycleCardButton: function (ref) {
        for (var i = this.pendingButtons.length - 1; i >= 0; --i) {
            var btn = this.pendingButtons[i];
            if (btn.ref === ref) {
                this.cardButtonsPool.push(btn);

                this.pendingButtons[i] = this.pendingButtons[this.pendingButtons.length - 1];
                this.pendingButtons.length--;
            }
        }

        for (var i = 0; i < this.cardButtons.length; ++i) {
            if (this.cardButtons[i] == null) {
                if (this.handIndex >= this.hand.length) {
                    this.handIndex = 0;
                }
                this.setCard(i, this.hand[this.handIndex]);
                this.handIndex++;
            }
        }
    },

    setEnergy: function (value) {
        this.energy = value;
    },
    update:function(dt)
    {
        this.cardButtons.map(card=>{
            card && card.update && card.update(dt);
        });
    }
});

module.exports = ActionBar;
