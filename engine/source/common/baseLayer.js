// @flow

import { connectStore, disconnectStore } from '../store/store';
import WaitingLayer from './waitingLayer';

var BaseLayer = cc.Layer.extend({
    ctor: function() {
        this._super();

        this.state = {};
        this._loadingOverlay = null;
    },    

    onEnter: function () {
        this._super();  
        connectStore(this);

        var self = this;

        this._appHideListener = cc.EventListener.create({
            event: cc.EventListener.CUSTOM, 
            eventName: "game_on_hide",
            callback: self.onAppHide.bind(self)
        });
        cc.eventManager.addListener(this._appHideListener, this);

        this._appShowListener = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "game_on_show", 
            callback: self.onAppShow.bind(self)
        });
        cc.eventManager.addListener(this._appShowListener, this);
    },

    onExit: function() {
        this._super();
        disconnectStore(this);

        cc.eventManager.removeListener(this._appShowListener);
        cc.eventManager.removeListener(this._appHideListener);
    },

    onAppHide: function() {
    },

    onAppShow: function() {
    },

    setState: function(state: any, cb: Function) {                
        const newState = Object.assign({}, this.state, state);             
        this.onNextState && this.onNextState(newState);          
        this.state = newState;
        this.onStateChange && this.onStateChange(this.state);
        cb && cb();      
    },

    showWaiting: function(visible: boolean, parent: cc.Node) {        
        if (visible && !this._loadingOverlay) {
            const node = parent || this;
            const size = node.getContentSize();
            this._loadingOverlay = new WaitingLayer(size);            
            node.addChild(this._loadingOverlay, 9000);
        }
        this._loadingOverlay && this._loadingOverlay.setVisible(visible);
    },

    showError: function(error, onClick) {
        const scene = this.getParent();
        scene.showError && scene.showError(error, onClick);
    }
});

module.exports = BaseLayer;
