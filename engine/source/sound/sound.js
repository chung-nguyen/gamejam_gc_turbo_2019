class Sound {
    _sound_pool = {};
    _sfx = {};
    preload(list, cb) {
        var soundExtension = this.getSoundExtension();
        var sources = [];
        list.map(path=>{
            sources.push(path+soundExtension);
        });
        loadResources(sources,_=>{
            cb && cb();
        });
    }

    getSoundExtension() {
        var a = document.createElement('audio');
        if(!!(a.canPlayType && a.canPlayType('audio/mpeg;').replace(/no/, ''))) return ".mp3";
        if (!!(a.canPlayType && a.canPlayType('audio/ogg;').replace(/no/, ''))) return ".ogg";
        return false;
    }

    getUrl(name)
    {
        return getResourceAlias(name+this.getSoundExtension());
    }

    setMusicVolume(level)
    {
        cc.audioEngine.setMusicVolume(level);
    }
    getMusicVolume(level) {
        cc.audioEngine.setMusicVolume(level);
    }

    setSfxVolume(level) {
        cc.audioEngine.setEffectsVolume(level);
    }
    getSfxVolume(level) {
        cc.audioEngine.getEffectsVolume(level);
    }

    playMusic(name,loop=true) {
        cc.audioEngine.playMusic(this.getUrl(name), loop);
    }

    stopMusic() {
        cc.audioEngine.stopMusic();
    }

    playSfx(name, loop = false) {
        this._sfx[name] = cc.audioEngine.playEffect(this.getUrl(name), loop);
    }

    stopSfx(name) {
        cc.audioEngine.stopEffect(this._sfx[name]);
    }

    stopAllSfx(name) {
        cc.audioEngine.stopAllEffects();
    }

    stopAll()
    {
        stopMusic();
        stopAllEffects();
    }
}

global.sound = global.sound || new Sound();

module.exports = sound;
