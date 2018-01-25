// @flow
export const LOGIN = "LOGIN";

export const login = (payload: any, callback: Function) => ({
    type: LOGIN,
    payload,
    callback,
    next: {
        persist: ["authenticate"]
    }
});

const actionHandler = {
    [LOGIN]: (state, action) => {
        return Object.assign(state, {
            id: action.payload.id
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