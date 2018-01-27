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
            scale9Size: cc.size(Defs.ACTION_BAR_WIDTH, Defs.ACTION_BAR_HEIGHT),
            anchorPoint: cc.p(0, 0),
            position: ui.relativeTo(this, ui.LEFT_BOTTOM, 0, 0),
            ignoreContentAdaptWithSize: false
        });

        this.panel = panel;
        this.team = opts.team;
        this.energy = 0;

        this.energyBar = new EnergyBar({
            width: Defs.ACTION_BAR_WIDTH,
            height: 50,
            team: 1,
            maxEnergy: opts.maxEnergy || 10
        });
        this.energyBar.setAnchorPoint(cc.p(0.5, 1));
        this.energyBar.setPosition(cc.p(Defs.ACTION_BAR_WIDTH / 2, 40));
        this.energyBar.setFill(0);
        panel.addChild(this.energyBar);

        this.buttonRoot = ui.makeNode(panel, {
            anchorPoint: cc.p(0, 0),
            position: ui.relativeTo(panel, ui.CENTER_BOTTOM, 0, 60)
        });

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
        var w = Defs.ACTION_BAR_WIDTH - 256;
        var x = -w / 2 + 64;
        var gap = w / Defs.MAX_CARDS_PER_ROUND;

        var count = 1;

        var dummyGroup = [];
        for (var j = 0; j < count; ++j) {
            var dummy = new DummyEntity();
            dummy.setOffset(0, 0);
            dummy.snap(name, this.team);
            this.battleRoot.addChild(dummy);
            dummyGroup.push(dummy);
        }

        var button = this.cardButtons[i];
        if (!button) {
            button = this.cardButtonsPool.pop();
            button.index = i;
            button.setPosition(ui.relativeTo(this.buttonRoot, ui.LEFT_MIDDLE, x + i * gap, 0));
            if (!button.getParent()) {
                this.buttonRoot.addChild(button);
            }

            this.cardButtons[i] = button;
        }

        button.setCharacterName(name, this.team);
        button.setDummies(dummyGroup);
        return button;
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
        this.energyBar.setFill(value);
    },
    update:function(dt)
    {
        this.cardButtons.map(card=>{
            card && card.update && card.update(dt);
        });
    }
});

module.exports = ActionBar;
