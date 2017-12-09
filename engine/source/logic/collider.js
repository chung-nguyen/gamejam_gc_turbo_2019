import FixedPoint from "./fixedpoint";

var Collider = function(opts) {
    this.collision = opts.collision;
    this.scale = opts.scale;
    this.entity = opts.entity;
};

Collider.prototype.test = function(other) {
    for (var i = this.collision.length - 1; i >= 0; --i) {
        var a = this.collision[i];
        var posA = {
            x: this.entity.x + a.offset.x * this.scale,
            y: this.entity.y + a.offset.y * this.scale
        };
        var radiusA = FixedPoint.num2fix(a.radius);

        for (var j = other.collision.length - 1; j >= 0; --j) {
            var b = other.collision[j];
            var posB = {
                x: other.entity.x + b.offset.x * other.scale,
                y: other.entity.y + b.offset.y * other.scale
            };
            var radiusB = FixedPoint.num2fix(b.radius);

            if (a.type === "circle") {
                if (b.type === "circle") {
                    if (testCircle2Cirlce(posA, radiusA, posB, radiusB)) {
                        return true;
                    }
                } else {
                    console.error("Collider: not implemented " + a.type + " vs " + b.type);
                }
            } else {
                console.error("Collider: not implemented " + a.type + " vs " + b.type);
            }
        }
    }

    return false;
};

function testCircle2Cirlce (posA, radiusA, posB, radiusB) {
    var R = radiusA + radiusB

    var dx = posB.x - posA.x;
    var dy = posB.y - posA.y;
    var d = FixedPoint.approxDistance(dx, dy);

    return d <= R;
}

module.exports = Collider;
