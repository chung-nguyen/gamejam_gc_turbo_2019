var ONE = 1.0;

var PI = Math.PI;
var TWO_PI = 2 * PI;
var MAX_ANGLE = 360;

var num2fix = function(value) {
    return value;
};

var fix2num = function(value) {
    return value;
};

var sin = function (value) {
    return Math.sin(value * Math.PI / 180);
}

var cos = function (value) {
    return Math.cos(value * Math.PI / 180);
}

var normalizeAngle = function(theta) {
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
};

var approxDistance = function(dx, dy) {
    /*var min, max, approx;

    if (dx < 0) dx = -dx;
    if (dy < 0) dy = -dy;

    if (dx < dy) {
        min = dx;
        max = dy;
    } else {
        min = dy;
        max = dx;
    }

    approx = max * 1007 + min * 441;
    if (max < min << 4) approx -= max * 40;

    // add 512 for proper rounding
    return (approx + 512) >> 10;*/

    return Math.sqrt(dx * dx + dy * dy);
};

var mult = function (a, b) {
    return a * b;
}

var div = function (a, b) {
    return a / b;
}

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
