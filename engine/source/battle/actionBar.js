import ui from "../utils/ui";

import ObjectPool from "../common/objectPool";

import Defs from "./defs";
import EnergyBar from "./energyBar";
import CardButton from "./cardButton";

import DummyEntity from "./dummyEntity";

var ActionBar = cc.Node.extend({
    ctor: function(opts) {
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

        this.energyBar = new EnergyBar({ width: Defs.ACTION_BAR_WIDTH - 170, height: 50, team: 1, maxEnergy: opts.maxEnergy || 10 });
        this.energyBar.setAnchorPoint(cc.p(0.5, 0));
        this.energyBar.setPosition(ui.relativeTo(panel, ui.CENTER_BOTTOM, 0, 60));
        this.energyBar.setFill(1020);
        panel.addChild(this.energyBar);

        this.buttonRoot = ui.makeNode(panel, {
            anchorPoint: cc.p(0.5, 0),
            position: ui.relativeTo(panel, ui.CENTER_TOP, 0, 90)
        });

        this._opts = opts;
        this.cardButtons = [];

        this.cardButtonsPool = new ObjectPool({
            onCreate: function () {
                return new CardButton();
            },
            onHide: function () {
                this.setVisible(false);
            },
            onShow: function () {
                this.setVisible(true);
            },
            onDestroy: function () {
                this.removeFromParentAndCleanup();
            }
        });

        this.pendingButtons = [];
        this.refCounter = 0;
        this.myPlayerIndex = -1;
    },

    setEngineGameId: function (value) {
        this.engineGameId = value;
    },

    setCurrentCards: function(team, cards) {
        this.clearCardButtons();

        this.cardButtons = [];

        var w = Defs.ACTION_BAR_WIDTH - 256;
        var x = -w / 2 + 64;
        var gap = w / cards.length;

        for (var i = 0; i < cards.length; ++i) {
            var name = cards[i];
            //var count = 1;

            //var formation = nativeEngine.getCardFormation(this.engineGameId, name, level);

            var dummyGroup = [];
            /*for (var j = 0; j < formation.length; ++j) {
                var f = formation[j];
                var dummy = new DummyEntity();
                dummy.setOffset(f.x, f.y);
                dummy.snap(f.name, team, f.level);
                this.battleRoot.addChild(dummy);
                dummyGroup.push(dummy);
            }*/

            var button = this.cardButtonsPool.pop();
            button.index = i;

            button.setCharacterName(name, team);
            button.setDummies(dummyGroup);

            this.buttonRoot.addChild(button);
            this.cardButtons.push(button);

            button.setPosition(cc.p(x, 0));
            x += gap;
        }
    },

    clearCardButtons: function() {
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
                return button;
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

        //this.socket.sendBuffer(nativeEngine.createTurnCommand(this.engineGameId, this.myPlayerIndex, Defs.DEPLOY_COMMAND, card.index, x, y, card.ref));
    }
});

module.exports = ActionBar;
