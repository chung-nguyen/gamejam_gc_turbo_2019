if (!cc.sys.isNative) {
    var nativeDevice = nativeDevice || {};
    var clientJS = new ClientJS();

    String.prototype.hashCode = function(){
        var hash = 0;
        if (this.length == 0) return hash;
        for (i = 0; i < this.length; i++) {
            char = this.charCodeAt(i);
            hash = ((hash<<5)-hash)+char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    }

    nativeDevice.getID = function() {
        var name = clientJS.getOS();
        if (clientJS.isMobile()) {
            if (clientJS.isMobileAndroid()) {
                name = 'android';
            } else if (clientJS.isMobileOpera) {
                name = 'opera';
            } else if (clientJS.isMobileWindows) {
                name = 'windows';
            } else if (clientJS.isMobileBlackBerry) {
                name = 'blackberry';
            } else {
                if (!name || name.length == 0) {
                    name = 'other';
                }
            }
        }

        var cpu = clientJS.getCPU();
        if (!cpu || cpu.length == 0) {
            cpu = 'other';
        }

        return name + ':' + cpu + ':' + clientJS.getFingerprint();
    }

    nativeDevice.getPassword = function() {
        var id = nativeDevice.getID();
        return id.hashCode();
    }

    nativeDevice.copyClipboard = function(content) {
        // TODO
    }

    nativeDevice.openSMSApp = function(to, body) {
        // TODO
    }
}
