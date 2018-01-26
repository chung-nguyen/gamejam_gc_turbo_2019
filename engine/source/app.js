import { createStore } from "./store/store";
import appState from "./reducer/appState";
import authenticate from "./reducer/authenticate";
import room from "./reducer/room";

// @flow
if (!window) {
    window = {};
}

window.SplashScene = require("./scenes/SplashScene");
window.InGameScene = require("./scenes/InGameScene");
window.LoadingScene = require("./scenes/LoadingScene");

window.initApp = function() {
    console.log("init app...");

    const store = createStore({
        appState,
        authenticate,
        room
    });

    store.restoreState();
};
