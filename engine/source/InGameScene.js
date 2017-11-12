import AvatarCache from "./common/avatarCache";
import BaseScene from "./common/baseScene";
import ui from "./utils/ui";

import Localize from "./localize";
import { storeDispatch, getStoreState } from "./store/store";

var InGameScene = BaseScene.extend({
    ctor: function() {
        this._super();
    },

    onEnter: function() {
        this._super();

        this.levelDesign = getStoreState().levelDesign.levels[0];
        console.log(this.levelDesign);
    },

    onExit: function() {
        this._super();
    }
});

module.exports = InGameScene;
