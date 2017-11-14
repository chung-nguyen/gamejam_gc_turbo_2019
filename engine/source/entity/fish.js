// @flow

var Fish = cc.Node.extend({
    ctor: function(opts: object) {
        this._super();

        this.sprite = new cc.Sprite("#fish1_swim_0.png");
        this.addChild(this.sprite, 0);

        this.name = opts.name;
        this.action = {
            swim: this.createAction(opts.swim),
            bite: this.createAction(opts.bite),
            sway: this.createAction(opts.sway)
        };
    },

    runAction: function(actionName: string) {
        this.sprite.runAction(this.action[actionName]);
    },

    getFrameName: function(action: object, num: number) {
        return this.name + "_" + action.alias + "_" + num + ".png";
    },

    createAction: function(action: object) {
        var animFrames = [];
        for (var i = 0; i < 8; i++) {
            var frame = cc.spriteFrameCache.getSpriteFrame(this.getFrameName(action, i));
            animFrames.push(frame);
        }

        var animation = new cc.Animation(animFrames, 1.0 / action.fps);
        return new cc.RepeatForever(new cc.Animate(animation));
    }
});

module.exports = Fish;
