import ui from "../utils/ui";

var EnergyBar = cc.Node.extend({
    ctor: function(opts) {
        this._super();

        opts.maxEnergy = opts.maxEnergy || 10;

        // Base
        var emptyBar = this;
        ui.makeImageView(emptyBar, {
            sprite: "empty_energy_bar.png",
            anchorPoint: cc.p(0.5, 0.5),
            position: cc.p(0, 0)
        });

        var barScale = emptyBar.getScale();

        // Fill
        this.halfFill = ui.makeProgressBar(emptyBar, {
            sprite: "half_fill_energy_bar.png",
            anchorPoint: cc.p(0, 0),
            position: cc.p(0, 0),
            scale: barScale,
            percent: 0
        });

        this.fullFill = ui.makeProgressBar(emptyBar, {
            sprite: "full_energy_bar_" + opts.team + ".png",
            anchorPoint: cc.p(0, 0),
            position: cc.p(0, 0),
            scale: barScale,
            percent: 0
        });

        // Icon
        ui.makeImageView(emptyBar, {
            sprite: "icon_energy_" + opts.team + ".png",
            anchorPoint: cc.p(0.5, 0.5),
            position: ui.relativeTo(emptyBar, ui.LEFT_MIDDLE, -opts.width / 4 - 200, 0),
            scale: barScale
        });

        // Number
        this.numberText = ui.makeText(emptyBar, {
            text: "0",
            font: getBigFontName(),
            fontSize: 48,
            anchorPoint: cc.p(0.5, 0.5),
            position: ui.relativeTo(emptyBar, ui.LEFT_MIDDLE, -opts.width / 4 - 200, 150),
            shadow: true
        });

        this._opts = opts;

        this._targetHalfFill = 0;
        this._targetFullFill = 0;
        this.scheduleUpdate();
    },

    setFill: function (value) {
        var maxEnergy = this._opts.maxEnergy;

        var whole = Math.floor(value / (maxEnergy * 100)) * 10;
        var part = value / (maxEnergy * 10);

        this.halfFill.setPercent(part);
        this.fullFill.setPercent(whole);

        this._targetHalfFill = part;
        this._targetFullFill = whole;

        this.numberText.setString(Math.floor(value / 1000).toString());
    },

    fillTo: function (value) {
        var maxEnergy = this._opts.maxEnergy;

        var whole = Math.floor(value / (maxEnergy * 100)) * 10;
        var part = value / (maxEnergy * 10);

        this._targetHalfFill = part;
        this._targetFullFill = whole;
    },

    update: function (dt) {
        var maxEnergy = this._opts.maxEnergy;

        var part = this._targetHalfFill;
        var whole = this._targetFullFill;

        this.halfFill.setPercent(this.halfFill.getPercent() + (part - this.halfFill.getPercent()) * Math.min(dt * 3, 1));
        this.fullFill.setPercent(this.fullFill.getPercent() + (whole - this.fullFill.getPercent()) * Math.min(dt * 6, 1));

        var val = ((this.fullFill.getPercent() + 1) * maxEnergy) / 100;
        this.numberText.setString(Math.floor(val).toString());
    }
});

module.exports = EnergyBar;
