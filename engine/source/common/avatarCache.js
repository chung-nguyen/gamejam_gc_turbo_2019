// @flow
const ONE_WEEK = 7 * 24 * 3600 * 1000;
const ONE_SECOND = 1000;
const MAX_MEMORY_USAGE = 16 * 1024 * 1024;

class AvatarCache {
    constructor() {
        this._cache = {};
        this._diskCache = {};

        this._diskCacheLock = new AsyncLock();
        this._isDiskCacheInfoDirty = false;
        this._memoryUsed = 0;
    }

    cleanUp() {
        for (var k in this._cache) {
            const avatar = this._cache[k];
            if (avatar.texture) {
                cc.textureCache.removeTexture(avatar.texture);
            }
            avatar.refsCount = 0;
            avatar.texture = null;
        }
        this._memoryUsed = 0;
    }

    free(info) {
        if (!info) {
            return;
        }
        const hash = this._getHash(info);
        const avatar = this._cache[hash];
        if (avatar) {
            avatar.loadingLock.enter(lock => {
                --avatar.refsCount;
                lock.leave();
            });

            if (avatar.refsCount <= 0) {
                cc.error("[AvatarCache] texture refs count < 0");
            }
        }
    }

    retain(info) {
        if (!info) {
            return;
        }
        const hash = this._getHash(info);
        let avatar = this._cache[hash];
        if (avatar) {
            avatar.loadingLock.enter(lock => {
                ++avatar.refsCount;
                lock.leave();
            });
        }
    }

    getRefsCount(info, cb) {
        if (!info) {
            return 0;
        }
        const hash = this._getHash(info);
        let avatar = this._cache[hash];
        if (avatar) {
            avatar.loadingLock.enter(lock => {
                cb && cb(avatar.refsCount);
                lock.leave();
            });
        } else {
            cb && cb(0);
        }
    }

    load(info, cb) {
        if (!info) {
            return;
        }
        const hash = this._getHash(info);
        let avatar = this._cache[hash];
        if (!avatar) {
            avatar = this._cache[hash] = {
                texture: null,
                refsCount: 0,
                loadingLock: new AsyncLock()
            };
        }

        avatar.loadingLock.enter(lock => {
            if (avatar.texture) {
                ++avatar.refsCount;
                cb && cb(avatar.texture, info);
                lock.leave();
            } else {
                this._getUrl(info, avatarUrl => {
                    cc.textureCache.addImage(avatarUrl, texture => {
                        if (texture instanceof cc.Texture2D) {
                            avatar.texture = texture;
                            ++avatar.refsCount;

                            const textureSize = texture.getContentSize();
                            this._memoryUsed += textureSize.width * textureSize.height * 4;
                            cb && cb(texture, info);
                        } else {
                            cb && cb(null, info);
                        }

                        lock.leave();
                    });
                });
            }
        });
    }

    isEqual(a, b) {
        if (a === null || b === null) {
            return false;
        }

        return a.avatarType === b.avatarType && a.avatarPath === b.avatarPath;
    }

    applyToSprite(info, sprite, spriteSize) {
        if (info) {
            const hash = this._getHash(info);
            let avatar = this._cache[hash];
            if (avatar) {
                avatar.loadingLock.enter(lock => {
                    if (avatar.texture) {
                        const textureSize = avatar.texture.getContentSize();
                        sprite.setTexture(avatar.texture);
                        sprite.setTextureRect(cc.rect(0, 0, textureSize.width, textureSize.height));
                        sprite.setScale(spriteSize.width / textureSize.width, spriteSize.height / textureSize.height);
                    }

                    lock.leave();
                });
            }
        }
    }

    update() {
        if (this._isDiskCacheInfoDirty && MyFileDownloader.isFinished()) {
            this._isDiskCacheInfoDirty = false;

            this._diskCacheLock.enter(lock => {
                this._storeDiskCacheInfo();
                lock.leave();
            });
        }

        if (this._memoryUsed > MAX_MEMORY_USAGE) {
            cc.log("[AvatarCache] gc");
            for (var k in this._cache) {
                const avatar = this._cache[k];
                if (avatar.texture && avatar.refsCount <= 0 && !avatar.loadingLock.isLocked()) {
                    avatar.loadingLock.enter(lock => {
                        const textureSize = avatar.texture.getContentSize();
                        this._memoryUsed -= textureSize.width * textureSize.height * 4;

                        if (avatar.texture) {
                            cc.textureCache.removeTexture(avatar.texture);
                        }
                        avatar.texture = null;

                        lock.leave();
                    });
                }
            }
        }
    }

    _loadDiskCacheInfo(cb) {
        if (cc.sys.isNative) {
            const localPath = getLocalCachePath();
            cc.loader.loadTxt(localPath + "/cache.json", (err, txt) => {
                // remove old cached avatars
                this._diskCacheLock.enter(lock => {
                    if (!err) {
                        if (txt) {
                            try {
                                this._diskCache = JSON.parse(txt);
                            } catch (e) {
                                cc.error(e);
                            }
                        }
                    } else {
                        cc.error(err);
                    }
                    
                    let isDirty = false;

                    if (this._diskCache) {
                        const now = Date.now();
                        for (var k in this._diskCache) {
                            const cache = this._diskCache[k];

                            if (!jsb.fileUtils.isFileExist(cache.filePath)) {
                                isDirty = true;
                                delete this._diskCache[k];
                            } else if (now - (cache.time || 0) > ONE_WEEK) {
                                isDirty = true;
                                jsb.fileUtils.removeFile(cache.filePath);
                                delete this._diskCache[k];
                            }
                        }
                    }

                    if (isDirty) {
                        this._storeDiskCacheInfo();
                    }
                    
                    lock.leave();
                    cb && cb();
                });
            });
        } else {
            cb && cb();
        }
    }

    _getUrl(info, cb) {
        const type = info.avatarType;
        const path = info.avatarPath;
        const size = 256;

        let url = cdnLocation + "avatars/0.png";
        let filename = type + "_" + path + ".png";
        if (type === "facebook") {
            url = "http://graph.facebook.com/" + path + "/picture?type=square&height=" + size + "&width=" + size;
        } else if (type === "facebook_friend") {
            url = info.avatarUrl;
        } else if (type === "preset") {
            url = cdnLocation + "avatars/" + path + ".png";
        }

        if (cc.sys.isNative) {
            const cache = this._diskCache[url];
            if (cache && jsb.fileUtils.isFileExist(cache.filePath)) {
                cb && cb(cache.filePath);
            } else {
                this._cacheUrl(url, filename, filePath => {
                    cb && cb(filePath);
                });
            }
        } else {
            cb && cb(url);
        }
    }

    _cacheUrl(url, filename, cb) {
        const localPath = getLocalCachePath() + "/";
        MyFileDownloader.start(
            {
                url,
                filesize: 0,
                filename: filename
            },
            localPath,
            (err, result) => {
                if (err) {
                    cc.error(err);
                } else {
                    cb && cb(result.saveTo);

                    this._diskCache[result.url] = {
                        filePath: result.saveTo,
                        filesize: result.filesize,
                        time: Math.floor(Date.now())
                    };

                    this._isDiskCacheInfoDirty = true;
                }
            }
        );
    }

    _getTotalDiskCacheSize() {
        let total = 0;
        for (var k in this._diskCache) {
            const cache = this._diskCache[k];
            total += cache.filesize || 0;
        }
        return total;
    }

    _getHash(info) {
        const type = info.avatarType;
        if (type === "facebook_friend") {
            return info.avatarUrl;
        }

        const path = info.avatarPath;
        return type + ":" + path;
    }

    _storeDiskCacheInfo() {
        jsb.fileUtils.writeStringToFile(JSON.stringify(this._diskCache), getLocalCachePath() + "/cache.json");
    }
}

module.exports = new AvatarCache();
