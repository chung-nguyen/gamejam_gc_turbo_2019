import ui from "../utils/ui";

import Defs from "./defs";

var TopBar = cc.Node.extend({
    ctor: function (opts) {
        this._super();

        var panel = ui.makeImageView(this, {
            sprite: "action_bar_panel.png",
            scale9Size: cc.size(Defs.TOP_BAR_WIDTH, Defs.TOP_BAR_HEIGHT),
            anchorPoint: cc.p(0, 1),
            position: ui.relativeTo(this, ui.LEFT_TOP, 0, 0),
            ignoreContentAdaptWithSize: false
        });

        ui.makeImageView(this, {
            sprite: "icon_coin.png",
            anchorPoint: cc.p(0, 0.5),
            position: ui.relativeTo(this, ui.LEFT_MIDDLE, 20, -Defs.TOP_BAR_HEIGHT / 2),
            contentSize: cc.size(40, 40),
            resizeMode: ui.RESIZE_STRETCH
        });

        this.goldText = ui.makeText(panel, {
            text: "",
            font: getNormalFontName(),
            anchorPoint: cc.p(0, 0.5),
            fontSize: 32,
            position: ui.relativeTo(panel, ui.LEFT_MIDDLE, 70, 0),
            horzAlign: cc.TEXT_ALIGNMENT_LEFT
        });

        ui.makeImageView(this, {
            sprite: "icon_time.png",
            anchorPoint: cc.p(0, 0.5),
            position: ui.relativeTo(this, ui.LEFT_MIDDLE, 240, -Defs.TOP_BAR_HEIGHT / 2),
            contentSize: cc.size(40, 40),
            resizeMode: ui.RESIZE_STRETCH
        });

        this.timeText = ui.makeText(panel, {
            text: "",
            font: getNormalFontName(),
            anchorPoint: cc.p(0, 0.5),
            fontSize: 32,
            position: ui.relativeTo(panel, ui.LEFT_MIDDLE, 300, 0),
            horzAlign: cc.TEXT_ALIGNMENT_LEFT
        });
    },

    setInfo: function (gold, time) {
        this.goldText.setString(Math.floor(gold / 1000));
        this.timeText.setString(Math.floor(time / 1000));
    }
});

module.exports = TopBar;
