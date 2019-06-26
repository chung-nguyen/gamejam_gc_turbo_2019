import ui from "../utils/ui";

import ObjectPool from "../common/objectPool";

import Defs from "./defs";
import CardButton from "./cardButton";

var ActionBar = cc.Node.extend({
    ctor: function (opts) {
        this._super();

        this.frame = ui.makeImageView(this, {
            sprite: "action_bar_panel.png",
            scale9Size: cc.size(Defs.ACTION_FIELD_WIDTH, Defs.ACTION_FIELD_HEIGHT),
            anchorPoint: cc.p(0, 0),
            position: ui.relativeTo(this, ui.LEFT_BOTTOM, (Defs.SCREEN_SIZE.width - Defs.ACTION_FIELD_WIDTH) / 2, Defs.ACTION_BAR_HEIGHT + 64),
            ignoreContentAdaptWithSize: false
        });

        this.socket = opts.socket;
        this.team = opts.team;

        this._opts = opts;
        this.cardButtons = [];
        this.hand = [];
        this.selectingCard = null;
        this.referenceCount = 1;

        this.formation = [];

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

    setHand: function (hand) {
        this.hand = hand;
        for (var i = 0; i < hand.length; ++i) {
            var pokemon = Defs.POKEMONS.find((it) => it.pokedex === hand[i]);
            this.addCard(i, pokemon);
        }

        this.selectingCard = this.cardButtons[0];
    },

    addCard: function (index, pokemon) {
        var button = new CardButton({
            actionBar: this
        });
        button.setPosition(index * (Defs.ACTION_BAR_HEIGHT * 0.75 + 20) + 20, Defs.ACTION_BAR_HEIGHT * 0.25);
        button.setPokemon(pokemon, this.team);

        this.cardButtons.push(button);
        this.addChild(button, 0);
    },

    select: function (card) {
        this.selectingCard = card;

        for (let i = 0; i < this.cardButtons.length; ++i) {
            this.cardButtons[i].unselect();
        }

        card.select();
    },

    setFormation: function (formation) {
        for (let i = 0; i < formation.units.length; ++i) {
            const unit = formation.units[i];
            let deployed = this.formation.find((it) => it.ref === unit.ref);
            if (!deployed) {
                const pokemon = Defs.POKEMONS.find((it) => it.pokedex === unit.name);

                deployed = ui.makeSprite(this.frame, {
                    sprite: pokemon.name.toLowerCase() + '.png'
                });

                this.formation.push(deployed);
            }

            deployed.setPosition(unit.x * 64 + Defs.ACTION_FIELD_WIDTH / 2 + 32, unit.y * 64 + 32);
        }
    },

    onTouchEnded: function (touch, event) {
    },

    onTouchBegan: function (touch, event) {
        if (this.containsTouchLocation(touch)) {
            var origin = this.frame.getPosition();
            var pt = touch.getLocation();
            var x = pt.x - origin.x;
            var y = pt.y - origin.y;

            x -= Defs.ACTION_FIELD_WIDTH / 2;

            x = Math.floor(x / 64);
            y = Math.floor(y / 64);

            this.socket.send({ x, y, type: "deploy", name: this.selectingCard.pokedex, ref: this.referenceCount++ });
        }
    },

    onTouchMoved: function (touch, event) {
    },

    onTouchCancelled: function (touch, event) {
    },

    containsTouchLocation: function(touch) {
        var pt = touch.getLocation();
        var sz = this.frame.getContentSize();
        var bb = cc.rect(0, 0, sz.width, sz.height);
        return cc.rectContainsPoint(bb, this.frame.convertToNodeSpace(pt));
    }
});

module.exports = ActionBar;
