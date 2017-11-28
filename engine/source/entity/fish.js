// @flow

var ANIMATION_CACHE = {};

var Fish = cc.Node.extend({
    ctor: function() {
        this._super();

        this.sprite = new cc.Sprite("#fish1_swim_0.png");
        this.addChild(this.sprite, 0);
    },

    reset: function (opts) {
        this.sprite.setScale(opts.scale || 1);

        this.name = opts.name;
        this.action = {
            swim: this.createAction(opts.swim),
            bite: this.createAction(opts.bite),
            sway: this.createAction(opts.sway)
        };
    },

    stopAllActions: function () {
        this.sprite.stopAllActions();
    },

    runAction: function(actionName: string) {
        this.sprite.runAction(this.action[actionName]);
    },

    getAnimationName: function(action: object) {
        return this.name + "_" + action.alias;
    },

    getFrameName: function(action: object, num: number) {
        return this.name + "_" + action.alias + "_" + num + ".png";
    },

    createAction: function(action: object) {
        var animationName = this.getAnimationName(action);
        var animation = ANIMATION_CACHE[animationName];

        if (!animation) {
            var animFrames = [];
            for (var i = 0; i < 8; i++) {
                var frame = cc.spriteFrameCache.getSpriteFrame(this.getFrameName(action, i));
                animFrames.push(frame);
            }

            animation = new cc.Animation(animFrames, 1.0 / action.fps);
            ANIMATION_CACHE[animationName] = animation;
        }

        return new cc.RepeatForever(new cc.Animate(animation));
    }
});

module.exports = Fish;
