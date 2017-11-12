var DOWNLOAD_PARALLEL_JOBS = 4;

cc.LabelTTF._wordRex = /([a-zA-Z0-9ÄÖÜäöüßçîûÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]+|\S)/;
cc.LabelTTF._lastWordRex = /([a-zA-Z0-9ÄÖÜäöüßçîûÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]+|\S)$/;
cc.LabelTTF._lastEnglish = /[a-zA-Z0-9ÄÖÜäöüßçîûÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]+$/;
cc.LabelTTF._firsrEnglish = /^[a-zA-Z0-9ÄÖÜäöüßçîûÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]/;

var bootstrapResources = {
    normalFont: { type: "font", name: "Normal", srcs: ["res/normal.otf"] },
    mediumFont: { type: "font", name: "Medium", srcs: ["res/medium.otf"] },
    bigFont: { type: "font", name: "Big", srcs: ["res/big.otf"] },
    bootstrapUI_plist: "res/bootstrap_0.plist",
    bootstrapUI_png: "res/bootstrap_0.png"
};

var bootstrapText = {
    downloading: {
        en: "Downloading",
        vn: "Đang tải dữ liệu"
    },
    downloadError: {
        en: "Could not update, please check your Internet connection",
        vn: "Không thể tải dữ liệu, vui lòng kiểm tra đường truyền Internet"
    },
    retry: {
        en: "Retry",
        vn: "Thử lại"
    },
    ok: {
        ok: "OK",
        vn: "OK"
    }
};

var currentLanguage = "vn";

var resourcePath = {};
var plistFiles = {};

var addResourcePath = function(name, url, localPath) {
    resourcePath[name] = {
        url: url,
        localPath: localPath
    };
};

var getResourcePaths = function(names) {
    var res = [];
    names.forEach(function(n) {
        if (n.split(".").pop() == "plist") {
            cc.log("get resource: " + n);
            plistFiles[n].forEach(function(fn) {
                var textureFileName = fn.substring(0, fn.indexOf(".")) + ".png";
                res.push(textureFileName);
                res.push(fn);
            });
        } else {
            res.push(n);
        }
    });

    if (cc.sys.isNative) {
        return res.map(function(name) {
            var res = resourcePath[name];
            if (!res) {
                cc.error("No resource: " + name);
                return "";
            }

            return res.localPath;
        });
    }

    return res.map(function(name) {
        var res = resourcePath[name];
        if (!res) {
            cc.error("No resource: " + name);
            return "";
        }

        return res.url;
    });
};

var getResourceAlias = function(name) {
    var res = resourcePath[name];
    if (!res) {
        cc.error("No resource: " + name);
        return "";
    }

    return cc.sys.isNative ? res.localPath : res.url;
};

var loadResources = function(list, cb) {
    cc.loader.load(getResourcePaths(list), function() {}, cb);
};

var addSpriteFramesFromResource = function(name) {
    plistFiles[name].forEach(function(fn) {
        var textureFileName = fn.substring(0, fn.indexOf(".")) + ".png";
        var texture = cc.textureCache.addImage(getResourceAlias(textureFileName));
        cc.spriteFrameCache.addSpriteFrames(getResourceAlias(fn), texture);
    });
};

var removeSpriteFramesFromResource = function(name) {
    plistFiles[name].forEach(function(fn) {
        cc.spriteFrameCache.removeSpriteFramesFromFile(getResourceAlias(fn));
    });
};

var setImmediate = function (handler) {
    setTimeout(handler, 0);
}

var BootstrapScene = cc.Scene.extend({
    init: function() {
        analytics.logEvent("app_open", {
            os: cc.sys.os
        });

        var self = this;
        var size = cc.winSize;
        var center = cc.p(size.width / 2, size.height / 2);

        cc.spriteFrameCache.addSpriteFrames(bootstrapResources.bootstrapUI_plist);

        // The spinner
        var spinner = (self._spinner = new cc.Node());
        spinner.setPosition(center);

        var loadingBkg = new ccui.ImageView("loading_bkg.png", ccui.Widget.PLIST_TEXTURE);
        spinner.addChild(loadingBkg, 0);

        var loadingDot = (self._loadingDot = new ccui.ImageView("loading_dot.png", ccui.Widget.PLIST_TEXTURE));
        spinner.addChild(loadingDot, 1);

        self._spinAngle = 0;
        //self.addChild(spinner, 2);

        var resToLoad = [bootstrapResources.normalFont, bootstrapResources.mediumFont, bootstrapResources.bigFont];

        cc.loader.load(
            resToLoad,
            function() {},
            function() {
                // bg
                var bg = cc.LayerColor.create(cc.color(255, 255, 255), size.width, size.height);                
                self.addChild(bg, 0);

                var logo = new ccui.ImageView("logo.png", ccui.Widget.PLIST_TEXTURE);
                var logoSize = logo.getContentSize();
                logo.setPosition(center);                
                self.addChild(logo, 1);

                // Loading box
                var loadingPanel = (self._loadingPanel = new ccui.ImageView("popup_frame.png", ccui.Widget.PLIST_TEXTURE));
                loadingPanel.setPosition(center.x, center.y);
                loadingPanel.ignoreContentAdaptWithSize(false);
                loadingPanel.setScale9Enabled(true);
                loadingPanel.setContentSize(900, 520);
                self.addChild(loadingPanel, 1);

                // loading percent
                var label = (self._label = new ccui.Text(bootstrapText.downloading[currentLanguage] + "...", getMediumFontName(), 48));
                label.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
                label.setPosition(450, 400);
                label.setColor(cc.color(255, 255, 255));
                loadingPanel.addChild(self._label, 10);

                // loading bar
                var loadingBkg = new ccui.ImageView("loadingbar.png", ccui.Widget.PLIST_TEXTURE);
                loadingBkg.setPosition(450, 250);
                loadingPanel.addChild(loadingBkg, 1);

                var loadingBar = (self._loadingBar = ccui.LoadingBar.create());
                loadingBar.loadTexture("loadingprogress.png", ccui.Widget.PLIST_TEXTURE);
                loadingBar.setScale(1);
                loadingBar.setPosition(loadingBkg.x, loadingBkg.y);
                loadingBar.setPercent(0);
                loadingPanel.addChild(loadingBar, 2);

                // alert
                var alertPanel = (self._alert = ccui.ImageView.create("popup_frame.png", ccui.Widget.PLIST_TEXTURE));
                alertPanel.ignoreContentAdaptWithSize(false);
                alertPanel.setScale9Enabled(true);
                alertPanel.setPosition(center.x, center.y);
                alertPanel.setContentSize(900, 520);

                var button = new ccui.Button();
                button.loadTextures("button_blue.png", "button_blue_pressed.png", "", ccui.Widget.PLIST_TEXTURE);
                button.setAnchorPoint(0.5, 0);
                button.setPosition(432, 50);
                button.addTouchEventListener(self._touchAlertButton, self);
                var buttonText = new ccui.Text(bootstrapText.ok[currentLanguage], getMediumFontName(), 48);
                buttonText.setPosition(148, 70);
                button.addChild(buttonText, 0);
                alertPanel.addChild(button);

                var errorLabel = new ccui.Text(bootstrapText.downloadError[currentLanguage], getNormalFontName(), 32);
                errorLabel.setPosition(cc.p(432, 200));
                errorLabel.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
                errorLabel.setColor(cc.color(255, 255, 255));
                errorLabel.setSize({ width: 800, height: 300 });
                errorLabel.ignoreContentAdaptWithSize(false);
                alertPanel.addChild(errorLabel);

                self._loadingPanel.setVisible(false);
                alertPanel.setVisible(false);

                self.addChild(alertPanel, 10);
            }
        );

        MyFileDownloader.init(DOWNLOAD_PARALLEL_JOBS);

        self._downloadedSize = 0;
        self._filesToDownload = null;
        self._filesList = null;
        self._totalSizeToDownload = 0;
        self._errorDuringDownload = false;

        return true;
    },

    onEnter: function() {
        cc.Node.prototype.onEnter.call(this);

        var self = this;
        ensureDirectoriesExist([getLocalResPath(), getLocalCachePath()], function() {
            setTimeout(function() {
                self._startLoading();
            }, 1000);
            self.scheduleUpdate();
        });
    },

    onExit: function() {
        cc.Node.prototype.onExit.call(this);
        this.unscheduleUpdate();
    },

    initWithResources: function(cdnLocation, cb) {
        var self = this;
        self.cdnLocation = cdnLocation;
        self.cb = cb;
    },

    _startLoading: function() {
        var self = this;

        var cdnLocation = self.cdnLocation;
        var localPath = getLocalResPath();

        // Cache busting param, once a second
        var now = Math.floor(new Date().getTime() / 1000);

        if (cc.sys.isNative) {
            // Wait a bit to ensure the directory was created
            setTimeout(function() {
                // Load old files list
                cc.loader.loadTxt(localPath + "/hash.json", function(err, txt0) {
                    // Get the files list from server
                    loadHttpText(cdnLocation + "hash.json?v=" + now, function(status, txt) {
                        if (status == 200) {
                            try {
                                self._processHashFileNativeVersion(txt, err ? null : txt0);
                            } catch (e) {
                                cc.error(e);

                                // Show error
                                self._showDownloadError();
                            }
                        } else {
                            cc.error("Could not load resources hash list");

                            // Show error
                            self._showDownloadError();
                        }
                    });
                });
            }, 1000);
        } else {
            // Get the files list from server
            loadHttpText(cdnLocation + "hash.json?v=" + now, function(status, txt) {
                if (status == 200) {
                    try {
                        self._processHashFileWebVersion(txt);
                    } catch (e) {
                        cc.error(e);

                        // Show error
                        self._showDownloadError();
                    }
                } else {
                    cc.error("Could not load resources hash list");

                    // Show error
                    self._showDownloadError();
                }
            });
        }
    },

    _processHashFileNativeVersion: function(txt, txt0) {
        var self = this;
        var localPath = getLocalResPath();

        var oldFileList;
        if (txt0 && txt0.length > 0) {
            try {
                oldFileList = JSON.parse(txt0);
            } catch (e) {}
        }
        if (!oldFileList) {
            oldFileList = { files: {}, totalFileSize: 0 };
        }

        // Validate the list
        for (var fn in oldFileList.files) {
            var path = localPath + "/" + fn;
            if (!jsb.fileUtils.isFileExist(path)) {
                oldFileList.files[fn].hash = "";
                oldFileList.files[fn].filesize = 0;
            }
        }

        // Native
        var filesToDownload = [];
        var totalSizeToDownload = 0;

        var filesList;
        try {
            filesList = JSON.parse(txt);
        } catch (e) {}

        if (filesList) {
            var version = filesList.version || 0;
            cc.log("Resource version: " + version);

            // save the info of multi-part plist files
            for (var fn in filesList.files) {
                if (fn.split(".").pop() == "plist") {
                    var name = fn.substr(0, fn.indexOf("_")) + ".plist";
                    if (!plistFiles[name]) {
                        plistFiles[name] = [];
                    }
                    plistFiles[name].push(fn);
                }
            }

            // Delete unnecessary files
            for (var fn in oldFileList.files) {
                if (!filesList.files[fn]) {
                    var path = localPath + "/" + fn;
                    if (jsb.fileUtils.isFileExist(path)) {
                        jsb.fileUtils.removeFile(path);
                    }
                }
            }

            // Check files needed to update
            for (var fn in filesList.files) {
                var url = cdnLocation + fn;
                if (!oldFileList.files[fn] || oldFileList.files[fn].hash != filesList.files[fn].hash) {
                    filesToDownload.push({ url: url, filesize: filesList.files[fn].filesize });
                    totalSizeToDownload += filesList.files[fn].filesize;
                }

                // Add to resource paths
                addResourcePath(fn, url, localPath + "/" + fn);
            }
        }

        cc.log("Downloading: " + totalSizeToDownload + " bytes");

        // Download files if necessary
        if (filesToDownload.length > 0) {
            self._downloadedSize = 0;
            self._loadingPanel.setVisible(true);
            self._totalSizeToDownload = totalSizeToDownload;
            self._filesList = filesList;
            self._filesToDownload = filesToDownload;
        } else {
            // Nothing to download - done
            self._done();
        }
    },

    _processHashFileWebVersion: function(txt) {
        var self = this;
        var localPath = getLocalResPath();

        var filesList;
        try {
            filesList = JSON.parse(txt);
        } catch (ex) {}

        if (filesList) {
            var version = filesList.version || 0;
            cc.log("Resource version: " + version);

            // save the info of multi-part plist files
            for (var fn in filesList.files) {
                if (fn.split(".").pop() == "plist") {
                    var name = fn.substr(0, fn.indexOf("_")) + ".plist";
                    if (!plistFiles[name]) {
                        plistFiles[name] = [];
                    }
                    plistFiles[name].push(fn);
                }
            }

            // Check files list
            for (var fn in filesList.files) {
                var hash = filesList.files[fn].hash;
                var url = cdnLocation + fn + "?v=" + hash;

                // Add to resource paths
                addResourcePath(fn, url, localPath + "/" + fn);

                if (fn === "bundle.js") {
                    setJSBundleHash(hash);
                }
            }
        }

        // Done
        self._done();
    },

    update: function(dt) {
        var self = this;
        if (self._filesToDownload) {
            self._spinner.setVisible(false);

            var localPath = getLocalResPath() + "/";

            self._loadingBar.setPercent(self._downloadedSize * 100 / (self._totalSizeToDownload || 1));
            if (self._errorDuringDownload) {
                self.unscheduleUpdate();
                self._filesToDownload = null;
                self._showDownloadError();
            } else {
                if (self._filesToDownload.length > 0 && MyFileDownloader.isVacant()) {
                    var task = self._filesToDownload.pop();
                    MyFileDownloader.start(task, localPath, function(err, result) {
                        cc.log(JSON.stringify(result));
                        if (err) {
                            self._errorDuringDownload = true;
                        } else {
                            self._downloadedSize += (result && result.filesize) || 0;
                        }
                    });
                } else {
                    if (MyFileDownloader.isFinished()) {
                        // Remember files with hashes
                        if (self._filesList) {
                            jsb.fileUtils.writeStringToFile(JSON.stringify(self._filesList), localPath + "/hash.json");
                        }

                        self._done();
                    }
                }
            }
        } else {
            self._spinner.setVisible(true);
            self._spinAngle += 360 * dt;
            if (self._spinAngle >= 360) {
                self._spinAngle -= 360;
            }
            self._loadingDot.setRotation(self._spinAngle);
        }
    },

    _done: function() {
        var self = this;
        self.unscheduleUpdate();
        setImmediate(function() {
            self.cb();
        });
    },

    _showDownloadError: function() {
        var self = this;
        self._errorDuringDownload = false;
        self._alert.setVisible(true);
        self._loadingPanel.setVisible(false);
    },

    _touchAlertButton: function(sender, type) {
        var self = this;
        if (type === ccui.Widget.TOUCH_ENDED) {
            self._alert.setVisible(false);
            setImmediate(function() {
                self._startLoading();
            });
            self.scheduleUpdate();
        }
    }
});

var _localCachePath = null;

var getFontName = function(res) {
    return cc.sys.isNative ? res.srcs[0] : res.name;
};

var getBigFontName = function() {
    return getFontName(bootstrapResources.bigFont);
};

var getMediumFontName = function() {
    return getFontName(bootstrapResources.mediumFont);
};

var getNormalFontName = function() {
    return getFontName(bootstrapResources.normalFont);
};

var ensureDirectoriesExist = function(paths, cb) {
    if (cc.sys.isNative) {
        setTimeout(function() {
            var needRecurse = false;
            for (var i = 0; i < paths.length; ++i) {
                var path = paths[i];
                if (!jsb.fileUtils.isDirectoryExist(path)) {
                    jsb.fileUtils.createDirectory(path);
                    needRecurse = true;
                }
            }

            if (needRecurse) {
                ensureDirectoriesExist(paths, cb);
            } else {
                cb && cb();
            }
        }, 1000);
    } else {
        cb && cb();
    }
};

var getLocalCachePath = function() {
    if (_localCachePath) {
        return _localCachePath;
    }

    _localCachePath = "";
    if (cc.sys.isNative) {
        _localCachePath = jsb.fileUtils.getWritablePath() + "cache";
    }

    return _localCachePath;
};

var MyFileDownloaderClass = function() {
    this.MAX_JOBS = 1;
    this._counter = 0;
};

MyFileDownloaderClass.prototype.init = function(maxJobs) {
    this.MAX_JOBS = maxJobs;
    this._counter = 0;

    this._locks = [];
    for (var i = 0; i < this.MAX_JOBS; ++i) {
        this._locks.push(new AsyncLock());
    }
};

MyFileDownloaderClass.prototype.start = function(task, destination, cb) {
    ++this._counter;
    if (this._counter >= this.MAX_JOBS) {
        this._counter = 0;
    }

    var self = this;
    var dlock = this._locks[this._counter];
    dlock.enter(function(lock) {
        var url = task.url;
        var filesize = task.filesize;
        var filename = task.filename || url.substring(url.lastIndexOf("/") + 1);
        var saveTo = destination + filename;

        try {
            jsb.saveRemoteFile(url, saveTo, function(downloadedSize) {
                var result = {
                    url: url,
                    saveTo: saveTo,
                    success: downloadedSize > 0,
                    filesize: downloadedSize
                };

                lock.leave();
                cb(downloadedSize > 0 ? null : true, result);
            });
        } catch (e) {
            lock.leave();
            cb(e, null);
        }
    });
};

MyFileDownloaderClass.prototype.isFinished = function() {
    for (var i = 0; i < this._locks.length; ++i) {
        if (this._locks[i].isLocked()) {
            return false;
        }
    }

    return true;
};

MyFileDownloaderClass.prototype.isVacant = function() {
    for (var i = 0; i < this._locks.length; ++i) {
        if (!this._locks[i].isLocked()) {
            return true;
        }
    }

    return false;
};

var MyFileDownloader = new MyFileDownloaderClass();

var initArray = function(length, value) {
    var arr = [];
    for (var i = 0; i < length; ++i) {
        arr.push(value);
    }
    return arr;
};

var loadHttpText = function(url, callback) {
    var xhr = cc.loader.getXMLHttpRequest();
    xhr.open("GET", url, true);

    // set the header
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            callback(xhr.status, xhr.responseText);
        }
    };

    xhr.onerror = function() {
        callback(xhr.status, "error");
    };

    xhr.send("");
};

ccui.Button.prototype.setActive = function(value) {
    this.setBright(value);
    this.setEnabled(value);
};

cc.shortAngleDist = function(a0, a1) {
    var max = Math.PI * 2;
    var da = (a1 - a0) % max;
    return (2 * da) % max - da;
};

cc.angleLerp = function(a0, a1, t) {
    return a0 + cc.shortAngleDist(a0, a1) * t;
};

var bootstrap = function(cdnLocation, callback) {
    var bootstrapScene = new BootstrapScene();
    bootstrapScene.init();
    bootstrapScene.initWithResources(cdnLocation, callback);
    cc.director.runScene(bootstrapScene);
};
