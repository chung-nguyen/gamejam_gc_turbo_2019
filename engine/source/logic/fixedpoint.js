var BIT_SHIFT = 16;
var ONE = 1 << BIT_SHIFT;

var PI = 205887;
var TWO_PI = 2 * PI;
var MAX_ANGLE = 360 << BIT_SHIFT;

var num2fix = function(value) {
    return value << BIT_SHIFT;
};

var fix2num = function(value) {
    return value / ONE;
};

var normalizeAngle = function (theta) {
    if (theta < 0) {
        while (theta < 0) {
            theta += MAX_ANGLE;
        }
    } else {
        while (theta >= MAX_ANGLE) {
            theta -= MAX_ANGLE;
        }
    }

    return theta;
}

module.exports = {
    num2fix,
    fix2num,
    normalizeAngle
};
