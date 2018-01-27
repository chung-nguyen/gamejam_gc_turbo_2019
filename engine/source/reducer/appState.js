// @flow
export const SET_APP_STATE = 'SET_APP_STATE';
export const LOAD_SPRITE = 'LOAD_SPRITE';
export const LOAD_SOUND = 'LOAD_SOUND';
export const UNLOAD_SPRITE = 'UNLOAD_SPRITE';
export const UNLOAD_SOUND = 'UNLOAD_SOUND';


export const setAppState = (data: any, callback: Function) => ({
    type: SET_APP_STATE,
    data,
    callback,
    next: {
        persist: ['appState']
    }
});

const actionHandler = {
    [SET_APP_STATE]: (state, action) => {
        return Object.assign({}, state, action.data);
    }
}

const initialState = {
    
}

export const appState = (state: any = initialState, action: any) => {
    const handler = action && actionHandler[action.type];
    return handler ? handler(state, action) : state;
}

export default appState;