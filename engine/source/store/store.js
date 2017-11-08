// @flow

import apiMiddleware from './api';
import storageMiddleware, { loadState } from './storage';
import nextMiddleware from './next';

const middlewares = [apiMiddleware, storageMiddleware, nextMiddleware];

class Store {
    state = {};
    _reducers = {};
    _connectedScenes = [];

    constructor(reducers: any) {
        this._reducers = reducers;
        this.clear();
    }

    getState() {
        return this.state;
    }

    clear() {
        this.state = Object.keys(this._reducers).reduce((prev, curr) => Object.assign(prev, { [curr]: this._reducers[curr]() }), {});
    }

    restoreState() {
        const storedStates = loadState(Object.keys(this.state));
        for (var k in storedStates) {
            this.state[k] = Object.assign({}, this.state[k], storedStates[k]);
        }
    }

    dispatch(action: any) {
        setImmediate(() => {
            if (typeof (action) === "function") {
                this.runDispatch(action(this.getState()), middlewares.slice(0));
            } else {
                this.runDispatch(action, middlewares.slice(0));
            }
        });
    }

    runDispatch(action: any, chain: []) {
        var that = this;
        var reducers = this._reducers;

        if (chain.length == 0) {
            setImmediate(() => {
                const state = this.state = Object.keys(reducers).reduce((prev, curr) => Object.assign(prev, { [curr]: reducers[curr](this.state[curr], action) }), {});
                const connectedScenes = this._connectedScenes;

                action.callback && action.callback(action, state);
                setImmediate(() => {
                    connectedScenes.forEach(scene => scene.onStoreChange(state));
                });
            });
        } else {
            chain[0](this, action,
                // next 
                (action) => {
                    chain.splice(0, 1);
                    that.runDispatch(action, chain);
                }
            );
        }
    }

    discard(action: any) {
        action.callback && action.callback(action, this.state);
    }
};

let _store: Store;

export const createStore = (reducers: any) => {
    _store = new Store(reducers);
    return _store;
};

export const storeDispatch = (action: any) => _store && _store.dispatch(action);

export const connectStore = (scene: any): any => {
    if (scene && scene.onStoreChange) {
        _store._connectedScenes.push(scene);
    }
};

export const disconnectStore = (scene: any) => {
    const idx = _store._connectedScenes.findIndex(scn => scn == scene);
    if (idx >= 0) {
        _store._connectedScenes.splice(idx, 1);
    }
};

export const getStoreState = (): any => _store && _store.getState();