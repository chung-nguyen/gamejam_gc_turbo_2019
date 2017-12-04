import FixedPoint from "./fixedpoint";

var Hook = function(opts) {
    this.originX = FixedPoint.num2fix(opts.position.x);
    this.originY = FixedPoint.num2fix(opts.position.y);

    this.initialLength = FixedPoint.num2fix(opts.initialLength);
    this.size = FixedPoint.num2fix(opts.size);
    this.pullSpeed = opts.pullSpeed || 10;
    this.throwSpeed = opts.throwSpeed || 10;
    this.rotatingSpeed = opts.rotatingSpeed || 20;

    this.length = this.initialLength;
    this.futureLength = this.length;

    this.isThrowing = false;
    this.direction = opts.initialDirection || 1;
    this.angle = FixedPoint.num2fix(opts.initialAngle || 270);
    this.futureAngle = this.angle;

    this.maxAngle = this.angle + FixedPoint.num2fix(opts.maxAngle || 40);
    this.minAngle = this.angle - FixedPoint.num2fix(opts.maxAngle || 40);

    this.updateCounter = 0;
};

Hook.prototype.move = function(dt) {
    var da = this.direction * this.rotatingSpeed * FixedPoint.num2fix(dt) / 1000;
    if ((this.direction > 0 && this.angle + da >= this.maxAngle) || (this.direction < 0 && this.angle + da <= this.minAngle)) {
        this.direction = -this.direction;
        da = this.direction * this.rotatingSpeed * FixedPoint.num2fix(dt) / 1000;
    }

    this.angle = FixedPoint.normalizeAngle(this.angle + da);

    if ((this.direction > 0 && this.angle + da >= this.maxAngle) || (this.direction < 0 && this.angle + da <= this.minAngle)) {
        this.direction = -this.direction;
        da = this.direction * this.rotatingSpeed * FixedPoint.num2fix(dt) / 1000;
    }

    this.futureAngle = this.angle + da;
};

Hook.prototype.isOutBound = function(bounds) {};

Hook.prototype.throw = function() {
    if (this.isThrowing) {
        return;
    }
};

Hook.prototype.pull = function() {
    if (!this.isThrowing) {
        return;
    }
};

Hook.prototype.getDisplayPosition = function() {
    return cc.p(FixedPoint.fix2num(this.originX), FixedPoint.fix2num(this.originY));
};

Hook.prototype.getDisplayAngle = function() {
    return FixedPoint.fix2num(this.angle);
};

Hook.prototype.getDisplayFutureAngle = function() {
    return FixedPoint.fix2num(this.futureAngle);
};

Hook.prototype.getDisplayLength = function() {
    return FixedPoint.fix2num(this.length);
};

Hook.prototype.getDisplayFutureLength = function() {
    return FixedPoint.fix2num(this.futureLength);
};

module.exports = Hook;
