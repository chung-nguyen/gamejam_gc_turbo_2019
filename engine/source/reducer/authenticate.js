// @flow
export const LOGIN = 'LOGIN';
export const LOGIN_EXTEND = 'LOGIN_EXTEND';
export const LOGOUT = 'LOGOUT';

export const login = (credential: string, payload: any, callback: Function) => ({
    type: LOGIN,
    credential,
    api: {
        endpoint: '/login/' + credential,
        payload
    },
    callback,
    next: {
        persist: ['authenticate']
    }    
});

export const loginExtend = (callback: Function) => ({
    type: LOGIN_EXTEND,
    api: {
        endpoint: '/login/extend'
    },
    callback,
    next: {
        persist: ['authenticate']
    }
});

export const logout = (callback: Function) => ({
    type: LOGOUT,
    callback,
    next: {
        persist: ['authenticate']
    }
});

const actionHandler = {
    [LOGIN]: (state, action) => {
        const result = action.response;
        const profile = result.gameProfile;              
        return Object.assign(state, {
            id: result.id,
            username: result.username,
            accessToken: result.accessToken,       
            profile: result.profile,
            credential: action.credential
        });
    },

    [LOGIN_EXTEND]: (state, action) => {
        const result = action.response;
        return Object.assign(state, {
            accessToken: result.accessToken
        });
    },

    [LOGOUT]: (state, action) => {
        return Object.assign(state, {
            userId: null,
            username: null,
            token: null,
            credential: null,
            cash: 0
        });
    }
}

const initialState = {
    accessToken: null
}

export const authenticate = (state: any = initialState, action: any) => {
    const handler = action && actionHandler[action.type];
    return handler ? handler(state, action) : state;
}

export default authenticate;