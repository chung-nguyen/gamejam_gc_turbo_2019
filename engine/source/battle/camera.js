var Camera = function () {
    this.translate = cc.p(0, 0);
    this.rotate = 0;
}

Camera.prototype.setRotate = function (value) {
    this.rotate = value;
}

Camera.prototype.setTranslate = function (value) {
    this.translate = value;
}

module.exports = new Camera();
