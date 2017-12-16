// @flow

var ANIMATION_CACHE = {};

var Fish = cc.Node.extend({
    ctor: function() {
        this._super();

        this.setCascadeOpacityEnabled(true);

        this.sprite = new cc.Sprite("#fish1_swim_0.png");
        this.addChild(this.sprite, 0);

        this.isCaught = false;
        this.hookPosition = cc.p(0, 0);
        this.potPosition = cc.p(0, 0);
    },

    reset: function(opts) {
        this.stopAllActions();
        this.setOpacity(255);
        this.setScale(1);
        this.setRotation(0);
        this.sprite.setScale(opts.scale || 1);

        this.name = opts.name;
        this.isCaught = false;
        this.action = {
            swim: this.createAction(opts.swim),
            bite: this.createAction(opts.bite),
            sway: this.createAction(opts.sway)
        };
    },

    stopAllActions: function() {
        this._super();
        this.sprite.stopAllActions();
    },

    playAnimation: function(actionName: string) {
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
    },

    setPotPosition: function(hookPos, potPos) {
        this.isCaught = true;
        this.hookPosition = hookPos;
        this.potPosition = potPos;

        this.playAnimation("bite");
        this.runAction(cc.sequence([
            cc.rotateTo(0.5, this.getScaleX() * (-45)),
            cc.delayTime(1.5),
            cc.callFunc(() => this.playAnimation("sway"))
        ]));
    },

    goIntoPot: function(cbDone) {
        this.stopAllActions();

        this.runAction(cc.sequence([
            cc.spawn([
                cc.bezierTo(1, [this.hookPosition, this.potPosition, this.potPosition]).easing(cc.easeInOut(3)),
                cc.rotateTo(1, -180),
                cc.scaleTo(1, 0, 0),
                cc.fadeOut(1)
            ]),
            cc.callFunc(() => cbDone(this))
        ]));
    }
});

module.exports = Fish;
