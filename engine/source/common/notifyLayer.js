// @flow
import Localize from '../localize';

import ui from '../utils/ui';

var NotifyLayer = ccui.Layout.extend({
    ctor: function () {
        this._super();

        cc.spriteFrameCache.addSpriteFrames('mainmenu.plist');

        this._error = {};
        this._onClick = null;

        var size: Size = cc.winSize;
        var center = cc.p(size.width / 2, size.height / 2);

        this.setBackGroundColor(cc.color(8, 8, 8, 128));
        this.setBackGroundColorOpacity(128);
        this.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
        this.setSize(size);

        var panel = ui.makeImageView(this, {
            sprite: 'popup_frame.png',
            scale9Size: cc.size(900, 520),
            position: ui.relativeTo(this, ui.CENTER, 0, 0),
            ignoreContentAdaptWithSize: false
        });

        this._text = ui.makeText(panel, {
            text: "",
            font: getNormalFontName(),
            fontSize: 32,
            position: ui.relativeTo(panel, ui.CENTER, 0, 40),
            size: cc.size(800, 250),
            ignoreContentAdaptWithSize: false
        });
        return true;
    },

    setText: function (text, onClick) {
        this._onClick = onClick;
        this._error = text;
        this._text.setString(JSON.stringify(this._error));
    }
});

export default NotifyLayer;