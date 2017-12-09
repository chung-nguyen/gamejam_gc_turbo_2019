import FixedPoint from "./fixedpoint";
import Collider from './collider';

var Fish = function(opts) {
    this.id = opts.id;

    this.direction = opts.direction;
    this.speed = opts.speed;

    this.type = opts.type;
    this.data = opts.data;

    this.x = FixedPoint.num2fix(opts.x);
    this.y = FixedPoint.num2fix(opts.y);

    this.futureX = this.x;
    this.futureY = this.y;
    this.caughtHook = null;
    this.isDead = false;
    this.updateCounter = 0;

    this.collider = new Collider({
        entity: this,
        collision: this.data.collision,
        scale: FixedPoint.num2fix(this.data.scale)
    });
};

Fish.prototype.move = function(dt) {
    if (!this.caughtHook) {
        var dx = this.direction * this.speed * FixedPoint.num2fix(dt) / 1000;
        this.x += dx;
        this.futureX = this.x + dx;
    } else {
        this.x = this.futureX;
        this.y = this.futureY;

        this.futureX = this.caughtHook.x;
        this.futureY = this.caughtHook.y;
    }
};

Fish.prototype.getDisplayPosition = function() {
    return cc.p(FixedPoint.fix2num(this.x), FixedPoint.fix2num(this.y));
};

Fish.prototype.getDisplayFuturePosition = function(dt) {
    return cc.p(FixedPoint.fix2num(this.futureX), FixedPoint.fix2num(this.futureY));
};

Fish.prototype.isOutBound = function(bounds) {
    return this.x - FixedPoint.num2fix(this.data.width) > FixedPoint.num2fix(bounds.right);
};

Fish.prototype.setCaught = function (hook) {
    this.caughtHook = hook;
}

Fish.prototype.goIntoNest = function () {
    this.isDead = true;
}

module.exports = Fish;
