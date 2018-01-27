export const ACTIVE_MENU = "ACTIVE_MENU";
export const SET_NAME = "SET_NAME";
export const SELECT_TEAM = "SELECT_TEAM";
export const ADJUST_SFX = "ADJUST_SFX";
export const ADJUST_MUSIC = "ADJUST_MUSIC";
export const PLAYGAME = "PLAYGAME";



export const activeMeu = (name) => ({
    type:ACTIVE_MENU,
    name
});

export const setName = (username) => ({
    type: SELECT_TEAM,
    username,
    next: {
        persist: ["username"]
    }
});

export const selectTeam = (team) => ({
    type:SELECT_TEAM,
    team,
    next: {
        persist:["team"]
    }
});

export const adjustSfx = (sfx_volume) => ({
    type: ADJUST_SFX,
    sfx_volume,
    next: {
        persist: ["sfx_volume"]
    }
});

export const adjustMusic = (music_volume) => ({
    type: ADJUST_MUSIC,
    music_volume,
    next: {
        persist: ["music_volume"]
    }
});

const actionHandler = {
    [ADJUST_MUSIC]: (state, action) => {
        const result = action.response;
        return Object.assign(state, result);
    }
}

const initialState = {
}

export const menu = (state: any = initialState, action: any) => {
    const handler = action && actionHandler[action.type];
    return handler ? handler(state, action) : state;
}

export default menu;
