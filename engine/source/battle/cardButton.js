import ui from "../utils/ui";
import Defs from "./defs";

var CardButton = cc.Node.extend({
    ctor: function (opts) {
        this._super();

        this.pokedex = "";
        this.name = "";
        this.team = 0;
        this.index = 0;

        this.actionBar = opts.actionBar;

        this.frame = ui.makeImageView(this, {
            sprite: "action_bar_panel.png",
            scale9Size: cc.size(Defs.ACTION_BAR_HEIGHT * 0.75, Defs.ACTION_BAR_HEIGHT * 0.75),
            anchorPoint: cc.p(0, 0),
            position: ui.relativeTo(this, ui.CENTER, 0, 0),
            ignoreContentAdaptWithSize: false
        });

        this.costText = ui.makeText(this.frame, {
            text: "0",
            font: getNormalFontName(),
            fontSize: 24,
            anchorPoint: cc.p(0.5, 0.5),
            position: ui.relativeTo(this.frame, ui.CENTER_BOTTOM, 0, 0),
            shadow: true,
            zOrder: 10
        });

        var spr = new cc.Sprite();
        this.sprite = spr;
        this.frame.addChild(spr);

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

        this.isSelected = false;
    },

    setPokemon: function (pokemon, team) {
        var pokedex = pokemon.pokedex;
        if (this.pokedex !== pokedex || this.team !== team) {
            this.pokedex = pokemon.pokedex;
            this.name = pokemon.name;
            this.team = team;
            this.sprite.setSpriteFrame(this.name.toLowerCase() + ".png");
            this.sprite.setAnchorPoint(cc.p(0.5, 0.5));
            this.sprite.setPosition(ui.relativeTo(this.frame, ui.CENTER, 0, 0));

            this.costText.setString(pokemon.total);
        }
    },

    unselect: function () {
        this.isSelected = false;
    },

    select: function () {
        this.isSelected = true;
    },

    onTouchEnded: function (touch, event) {},

    onTouchBegan: function (touch, event) {
        if (this.containsTouchLocation(touch)) {
            this.actionBar.select(this);
        }
    },

    onTouchMoved: function (touch, event) {},

    onTouchCancelled: function (touch, event) {},

    containsTouchLocation: function (touch) {
        var pt = touch.getLocation();
        var sz = this.frame.getContentSize();
        var bb = cc.rect(0, 0, sz.width, sz.height);
        return cc.rectContainsPoint(bb, this.frame.convertToNodeSpace(pt));
    }
});

module.exports = CardButton;
