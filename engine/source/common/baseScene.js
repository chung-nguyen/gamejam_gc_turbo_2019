// @flow

import { connectStore, disconnectStore } from '../store/store';
import AlertLayer from './alertLayer';
import WaitingLayer from './waitingLayer';

var BaseScene = cc.Scene.extend({
    ctor: function(opt) {
        opt = opt || {
            sprites: [],
            persitSprites: [],
            sounds:[]
        }
        this._super();
        this.state = {};         
        this._waitingLayer = null;
        this._alertLayer = null;         
        this._loadingCount = 0;
        this._sprites = opt.sprites || [];
        this._persitSprites = opt.persitSprites || [];
        this._sounds = opt.sounds || [];
    },    

    onEnter: function () {
        this._super();  
        connectStore(this);
        this.loadResource();
        this.loadSound();
    },
    checkReady:function(isDone)
    {
        if(this._loadingCount==0)
        {
            this.onLoading && this.onLoading();
        }
        this._loadingCount += isDone ? -1 : 1;
        if(this._loadingCount==0)
        {
            this.onReady && this.onReady();
        }
    },
    loadSound:function()
    {
        this.checkReady(false);
        if(this._sounds.length)
        {
            Sound.preload(this._sounds,_=>{
                this.checkReady(true);
            });
        }else{
            this.checkReady(true);
        }
    },
    loadResource:function(){
        this.checkReady(false);
        if (this._sprites.length||this._persitSprites.length) {
            var sprites = [].concat(this._sprites,this._persitSprites);
            loadResources(sprites, () => {
                sprites.map(sprite=>{
                    addSpriteFramesFromResource(sprite);
                });
                this.checkReady(true);
            });
        }else{
            this.checkReady(true);
        }
    },
    unloadResource:function()
    {
        if (this._sprites.length) {
            this._sprites.map(sprite => {
                removeSpriteFramesFromResource(sprite);
            });
        }
    },
    onExit: function() {
        this._super();
        disconnectStore(this);
        this.unloadResource();
    },

    onLoading:function()
    {
        this.showWaiting(true);
    },

    onReady: function()
    {
        this.showWaiting(false);
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
