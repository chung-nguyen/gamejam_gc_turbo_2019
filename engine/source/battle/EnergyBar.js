import ui from "../utils/ui";

var EnergyBar = cc.Node.extend({
    ctor: function(opts) {
        this._super();

        opts.maxEnergy = opts.maxEnergy || 10;

        // Base
        var emptyBar = ui.makeImageView(this, {
            sprite: "empty_energy_bar.png",
            anchorPoint: cc.p(0.5, 0.5),
            position: cc.p(0, 0),
            contentSize: cc.size(opts.width, opts.height)
        });

        var barScale = emptyBar.getScale();

        // Fill
        this.halfFill = ui.makeProgressBar(this, {
            sprite: "half_fill_energy_bar.png",
            anchorPoint: cc.p(0.5, 0.5),
            position: cc.p(0, 0),
            scale: barScale,
            percent: 0
        });

        this.fullFill = ui.makeProgressBar(this, {
            sprite: "full_energy_bar_" + opts.team + ".png",
            anchorPoint: cc.p(0.5, 0.5),
            position: cc.p(0, 0),
            scale: barScale,
            percent: 0
        });

        // Separators
        var gap = opts.width / opts.maxEnergy;
        var x = -opts.width / 2 + gap;
        for (var i = 0; i < opts.maxEnergy - 1; ++i) {
            ui.makeImageView(this, {
                sprite: "energy_bar_separator.png",
                anchorPoint: cc.p(0.5, 0.5),
                position: cc.p(x, 0),
                scaleX: 1,
                scaleY: barScale
            });

            x += gap;
        }

        // Icon
        ui.makeImageView(this, {
            sprite: "icon_energy_" + opts.team + ".png",
            anchorPoint: cc.p(0.25, 0.5),
            position: cc.p(-opts.width / 2, 0),
            scale: barScale
        });

        // Number
        this.numberText = ui.makeText(this, {
            text: "0",
            font: getBigFontName(),
            fontSize: 48,
            anchorPoint: cc.p(1, 0.5),
            position: cc.p(-opts.width / 2 - 20 * barScale, 0),
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
