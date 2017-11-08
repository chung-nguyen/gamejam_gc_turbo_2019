if (!Math) {
    Math = {};
}

Math.normalizeAngle = function(value) {
    var x = value % 360;
    return x < 0 ? x + 360 : x;
}
