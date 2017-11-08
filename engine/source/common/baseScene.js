// @flow

import { connectStore, disconnectStore } from '../store/store';
import AlertLayer from './alertLayer';
import WaitingLayer from './waitingLayer';

var BaseScene = cc.Scene.extend({
    ctor: function() {
        this._super();
        this.state = {};         
        this._waitingLayer = null;
        this._alertLayer = null;             
    },    

    onEnter: function () {
        this._super();  
        connectStore(this);
    },

    onExit: function() {
        this._super();
        disconnectStore(this);
    },

    setState: function(state, cb) {
        const newState = Object.assign({}, this.state, state);             
        this.onNextState && this.onNextState(newState);          
        this.state = newState;
        this.onStateChange && this.onStateChange(this.state);            
        cb && cb();           
    },

    showWaiting: function(visible) {        
        if (visible && !this._waitingLayer) {
            this._waitingLayer = new WaitingLayer(cc.winSize);
            this.addChild(this._waitingLayer, 9000);
        }
        this._waitingLayer && this._waitingLayer.setVisible(visible);
    },

    showError: function(error, onClick) {
        if (!this._alertLayer) {
            this._alertLayer = new AlertLayer(cc.winSize);
            this.addChild(this._alertLayer, 9900);
        }
        this._alertLayer.setError(error, onClick);
        this._alertLayer.setVisible(true);
    }    
});

module.exports = BaseScene;
