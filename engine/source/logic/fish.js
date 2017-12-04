import Fixedpoint from "./fixedpoint";

var Fish = function(opts) {
    this.id = opts.id;

    this.direction = opts.direction;
    this.speed = opts.speed;

    this.type = opts.type;
    this.data = opts.data;

    this.x = Fixedpoint.num2fix(opts.x);
    this.y = Fixedpoint.num2fix(opts.y);

    this.futureX = this.x;
    this.updateCounter = 0;
};

Fish.prototype.move = function(dt) {
    var dx = this.direction * this.speed * Fixedpoint.num2fix(dt) / 1000;
    this.x += dx;
    this.futureX = this.x + dx;
};

Fish.prototype.getDisplayPosition = function() {
    return cc.p(Fixedpoint.fix2num(this.x), Fixedpoint.fix2num(this.y));
};

Fish.prototype.getDisplayFuturePosition = function(dt) {
    return cc.p(Fixedpoint.fix2num(this.futureX), Fixedpoint.fix2num(this.y));
};

Fish.prototype.isOutBound = function(bounds) {
    return this.x - Fixedpoint.num2fix(this.data.width) > Fixedpoint.num2fix(bounds.right);
};

module.exports = Fish;
