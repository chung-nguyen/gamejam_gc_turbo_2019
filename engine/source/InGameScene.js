import AvatarCache from "./common/avatarCache";
import BaseScene from "./common/baseScene";
import ui from "./utils/ui";

import Localize from "./localize";
import { storeDispatch, getStoreState } from "./store/store";
import Fish from "./entity/fish";

var InGameScene = BaseScene.extend({
    ctor: function() {
        this._super();
    },

    onEnter: function() {
        this._super();

        this.levelDesign = getStoreState().levelDesign.levels[0];
        this.showWaiting(true);
        loadResources(["fishes.plist"], () => {
            addSpriteFramesFromResource("fishes.plist");

            var test = new Fish({
                name: "fish1",
                swim: { alias: "swim", frameCount: 13, fps: 30 },
                bite: { alias: "swim", frameCount: 13, fps: 30 },
                sway: { alias: "swim", frameCount: 13, fps: 30 }
            });

            test.setPosition(cc.p(200, 200));
            test.runAction("swim");

            this.addChild(test, 1);
            this.showWaiting(false);
        });
    },

    onExit: function() {
        this._super();

        removeSpriteFramesFromResource("fishes.plist");
    }
});

module.exports = InGameScene;
