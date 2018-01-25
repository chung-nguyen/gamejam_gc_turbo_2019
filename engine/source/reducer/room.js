// @flow
export const START_BATTLE = "START_BATTLE";

export const startBattle = (payload: any, callback: Function) => ({
    type: START_BATTLE,
    api: {
        endpoint: '/battle/start',
        payload
    },
    callback
});

const actionHandler = {
    [START_BATTLE]: (state, action) => {
        const result = action.response;
        return Object.assign(state, result);
    }
}

const initialState = {
}

export const room = (state: any = initialState, action: any) => {
    const handler = action && actionHandler[action.type];
    return handler ? handler(state, action) : state;
}

export default room;
