module.exports = function approxDistance (dx, dy) {
    var min, max, approx;

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
    return (approx + 512) / 1024;
}
