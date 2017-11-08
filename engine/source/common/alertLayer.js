// @flow
import Localize from '../localize';

import ui from '../utils/ui';

var AlertLayer = ccui.Layout.extend({
    ctor: function() {
        this._super();

        cc.spriteFrameCache.addSpriteFrames('mainmenu.plist');

        this._error = {};
        this._onClick = null;

        var size: Size = cc.winSize;
        var center = cc.p(size.width / 2, size.height /2);

        this.setBackGroundColor(cc.color(8, 8, 8, 128));
        this.setBackGroundColorOpacity(128);
        this.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
        this.setSize(size);
        this.setTouchEnabled(true);
        this.setSwallowTouches(true);        

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

        var button = ui.makeButton(panel, {
            normal: "button_blue.png", 
            pressed: "button_blue_pressed.png", 
            anchorPoint: cc.p(0.5, 0),
            position: ui.relativeTo(panel, ui.CENTER_BOTTOM, 0, 30),
            listener: this.touchEvent,
            listenerTarget: this
        });

        ui.makeText(button, {
            text: Localize.getCaps('ok'),
            font: getBigFontName(),
            fontSize: 32,
            position: ui.relativeTo(button, ui.CENTER, 0, 0)
        });

        return true;
    },

    setError: function(error, onClick) {
        this._onClick = onClick;

        this._error = error;        
        this._text.setString(JSON.stringify(this._error));
    },

    touchEvent: function(sender, type) {
        if (type == ccui.Widget.TOUCH_ENDED)
        {            
            this.setVisible(false);
            this._onClick && this._onClick();   
        }
    }
});

export default AlertLayer;