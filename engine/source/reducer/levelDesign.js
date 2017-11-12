// @flow
export const FETCH_LEVEL_DESIGN = 'FETCH_LEVEL_DESIGN';

// TODO: give api url to fetch level when we have a server
export const fetchLevelDesign = (callback: Function) => ({
    type: FETCH_LEVEL_DESIGN,
    callback,
    next: {
        persist: ['appState']
    }
});

const actionHandler = {
    [FETCH_LEVEL_DESIGN]: (state, action) => {        
        if (action.data) {
            return Object.assign({}, state, action.data);
        }

        return state;
    }
}


const initialState = {
    levels: [
        // 1
        {
            players: [
                // Player 1
                { 
                    hookPosition: { x: 600, y: 140 }
                },
                // Player 1
                {
                    hookPosition: { x: 1320, y: 140 }
                }
            ],

            lines: [
                // Line 1
                {
                    area: { x: 0, y: 440, width: 1920, height: 10 },                    
                    schools: [
                        {
                            type: "fish1",
                            size: 40,
                            count: [1, 3],
                            gap: [200, 400]
                        },
                        {
                            type: "fish2",
                            size: 40,
                            count: [1, 3],
                            gap: [200, 400]
                        },
                        {
                            type: "fish3",
                            size: 40,
                            count: [1, 3],
                            gap: [200, 400]
                        }
                    ]
                }
            ]
        }
    ]
}

export const levelDesign = (state: any = initialState, action: any) => {
    const handler = action && actionHandler[action.type];
    return handler ? handler(state, action) : state;
}

export default levelDesign;