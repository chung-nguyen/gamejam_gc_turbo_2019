// @flow

const PREFIX = 'douchebag.';

export const storageMiddleware = (store: Store, action: any, next: Function) => {
    if (action.persist) {
        action.persist.forEach((key) => {
            const state = store.getState();
            const value = state[key];
            if (value) {        
                cc.sys.localStorage.setItem(JSON.stringify(PREFIX + key), JSON.stringify(value) );
            }            
        });        
    }

    next(action);
}

export const loadState = (keys: []) => {
    const state = {};
    keys.forEach(key => {        
        try {
            const val = JSON.parse(cc.sys.localStorage.getItem(JSON.stringify(PREFIX + key)));
            state[key] = val || {};
        } catch (e) {            
        }        
    });

    return state;
}

export default storageMiddleware;