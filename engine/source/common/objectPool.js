var ObjectPool = function(opts) {
    var { onCreate, onShow, onHide, onDestroy } = opts;

    this.list = [];

    this.onCreate = onCreate;
    this.onShow = onShow;
    this.onHide = onHide;
    this.onDestroy = onDestroy;
};

ObjectPool.prototype.clear = function() {
    for (var i = this.length - 1; i >= 0; --i) {
        this.onDestroy.call(this.list[i]);
    }
    this.list = [];
};

ObjectPool.prototype.push = function(obj) {
    this.onHide.call(obj);
    this.list.push(obj);
    return obj;
};

ObjectPool.prototype.pop = function() {
    var obj;

    if (this.list.length > 0) {
        this.list[this.list.length - 1];
        --this.list.length;
    } else {
        obj = this.onCreate();
    }

    this.onShow.call(obj);
    return obj;
};

module.exports = ObjectPool;
