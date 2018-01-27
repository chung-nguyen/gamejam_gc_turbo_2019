import { createStore } from "./store/store";
import appState from "./reducer/appState";
import authenticate from "./reducer/authenticate";
import room from "./reducer/room";

// @flow
if (!window) {
    window = {};
}
window.MenuScene = require("./scenes/MenuScene");
window.SplashScene = require("./scenes/SplashScene");
window.InGameScene = require("./scenes/InGameScene");
window.LoadingScene = require("./scenes/LoadingScene");
window.Sound = require("./sound/sound");

window.initApp = function() {
    console.log("init app...");

    const store = createStore({
        appState,
        authenticate,
        room
    });

    store.restoreState();
};
