// @flow
import ui from '../utils/ui';

var WaitingLayer = ccui.Layout.extend({
    ctor: function (size: Size) {
        this._super();

        this._loadingProgress = 0;

        this.setBackGroundColor(cc.color(8, 8, 8, 128));
        this.setBackGroundColorOpacity(128);
        this.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
        this.setSize(size);
        this.setTouchEnabled(true);
        this.setSwallowTouches(true);

        ui.makeImageView(this, { sprite: 'loading_bkg.png', zOrder: 1 });
        this._loadingDot = ui.makeImageView(this, { sprite: 'loading_dot.png', zOrder: 2 });

        this.setVisible(false);
        return true;
    },

    setVisible: function (visible) {
        this._super(visible);
        if (visible) {
            this.scheduleUpdate();
        } else {
            this.unscheduleUpdate();
        }
    },

    update: function (dt) {
        this._loadingProgress += 360 * dt;
        if (this._loadingProgress >= 360) {
            this._loadingProgress -= 360;
        }
        this._loadingDot.setRotation(this._loadingProgress);
    }
});

export default WaitingLayer;