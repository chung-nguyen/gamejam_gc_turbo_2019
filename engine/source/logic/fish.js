var POSITION_BIT_SHIFT = 16;

var Fish = function (opts) {
    this.id = opts.id;

    this.direction = opts.direction;
    this.speed = opts.speed;

    this.type = opts.type;
    this.data = opts.data;

    this.x = opts.x << POSITION_BIT_SHIFT;
    this.y = opts.y << POSITION_BIT_SHIFT;

    this.futureX = this.x;
    this.updateCounter = 0;
}

Fish.prototype.move = function (dt) {
    var dx = this.direction * this.speed * (dt << POSITION_BIT_SHIFT) / 1000;
    this.x += dx;
    this.futureX = this.x + dx;
}

Fish.prototype.getDisplayPosition = function () {
    return cc.p(this.x / (1 << POSITION_BIT_SHIFT), this.y / (1 << POSITION_BIT_SHIFT));
}

Fish.prototype.getDisplayFuturePosition = function (dt) {
    return cc.p(this.futureX / (1 << POSITION_BIT_SHIFT), this.y / (1 << POSITION_BIT_SHIFT));
}

Fish.prototype.isOutBound = function (bounds) {
    return this.x - (this.data.width << POSITION_BIT_SHIFT) > (bounds.right << POSITION_BIT_SHIFT);
}

module.exports = Fish;