import { ADJUST_SFX, ADJUST_MUSIC, PLAYGAME, SELECT_TEAM, PLAYGAME } from "../reducer/menu";
import sound from "../sound/sound";
export const menuMiddleware = (store, action, next) => {
    switch (action.type) {
        case ADJUST_MUSIC:
            sound.setVolume(action.sfx_volume);
            break;
    }
};