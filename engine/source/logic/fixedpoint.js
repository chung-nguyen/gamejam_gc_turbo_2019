var ONE = 1.0;

var PI = 3.141592654;
var TWO_PI = 2 * PI;

var num2fix = function (value) {
    return value;
};

var fix2num = function (value) {
    return value;
};

var sin = function (value) {
    var inValue = value * PI / 180;
    if (inValue < -PI) {
        inValue += TWO_PI;
    } else if (inValue > PI) {
        inValue -= TWO_PI;
    }

    var B = 1.2732395; // 4/pi
    var C = -0.40528473; // -4 / (pi^2)

    return inValue > 0 ? B * inValue + C * inValue * inValue : B * inValue - C * inValue * inValue;
};

var cos = function (value) {
    return sin(value + 90);
};

var normalizeAngle = function (theta) {
    if (theta < 0) {
        while (theta < 0) {
            theta += 360;
        }
    } else {
        while (theta >= 360) {
            theta -= 360;
        }
    }

    return theta;
};

var approxDistance = function (x, y) {
    // Approximation by using octagons approach
    return (
        1.426776695 *
        Math.min(0.7071067812 * (Math.abs(x) + Math.abs(y)), Math.max(Math.abs(x), Math.abs(y)))
    );
};

var mult = function (a, b) {
    return a * b;
};

var div = function (a, b) {
    return a / b;
};

module.exports = {
    ONE,

    num2fix,
    fix2num,
    normalizeAngle,
    approxDistance,
    mult,
    div,

    sin,
    cos
};
