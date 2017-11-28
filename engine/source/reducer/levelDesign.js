// @flow
export const FETCH_LEVEL_DESIGN = "FETCH_LEVEL_DESIGN";

// TODO: give api url to fetch level when we have a server
export const fetchLevelDesign = (callback: Function) => ({
    type: FETCH_LEVEL_DESIGN,
    callback,
    next: {
        persist: ["appState"]
    }
});

const actionHandler = {
    [FETCH_LEVEL_DESIGN]: (state, action) => {
        if (action.data) {
            return Object.assign({}, state, action.data);
        }

        return state;
    }
};

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
                    direction: 1,
                    speed: 50,
                    schools: [
                        {
                            type: ["fish1"],
                            count: [1, 3],
                            gap: [1500, 2000],
                            nextSchoolGap: [4000, 6000]
                        },
                        {
                            type: ["fish2"],
                            count: [1, 3],
                            gap: [1500, 2000],
                            nextSchoolGap: [4000, 6000]
                        },
                        {
                            type: ["fish3"],
                            count: [1, 3],
                            gap: [1500, 2000],
                            nextSchoolGap: [4000, 6000]
                        }
                    ]
                }
            ],

            // Fishes definition
            fishDefs: {
                fish1: {
                    name: "fish1",
                    scale: 0.4,
                    width: 80,
                    swim: { alias: "swim", frameCount: 13, fps: 30 },
                    bite: { alias: "swim", frameCount: 13, fps: 30 },
                    sway: { alias: "swim", frameCount: 13, fps: 30 }
                },
                fish2: {
                    name: "fish1",
                    scale: 0.4,
                    width: 80,
                    swim: { alias: "swim", frameCount: 13, fps: 30 },
                    bite: { alias: "swim", frameCount: 13, fps: 30 },
                    sway: { alias: "swim", frameCount: 13, fps: 30 }
                },
                fish3: {
                    name: "fish1",
                    scale: 0.4,
                    width: 80,
                    swim: { alias: "swim", frameCount: 13, fps: 30 },
                    bite: { alias: "swim", frameCount: 13, fps: 30 },
                    sway: { alias: "swim", frameCount: 13, fps: 30 }
                }
            }
        }
    ]
};

export const levelDesign = (state: any = initialState, action: any) => {
    const handler = action && actionHandler[action.type];
    return handler ? handler(state, action) : state;
};

export default levelDesign;
