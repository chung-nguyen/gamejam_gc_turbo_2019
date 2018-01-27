module.exports = {
    LEFT_TOP: 0b0000,
    LEFT_MIDDLE: 0b0001,
    LEFT_BOTTOM: 0b0010,
    CENTER_TOP: 0b0100,
    CENTER: 0b0101,
    CENTER_BOTTOM: 0b0110,
    RIGHT_TOP: 0b1000,
    RIGHT_MIDDLE: 0b1001,
    RIGHT_BOTTOM: 0b1010,

    RESIZE_STRETCH: 0,
    RESIZE_COVER: 1,
    RESIZE_CONTAIN: 2,

    makeNode: function(root, opts) {
        var node = new cc.Node();
        node.setPosition(opts.position || cc.p(0, 0));
        node.setAnchorPoint(opts.anchorPoint || cc.p(0.5, 0.5));
        node.setContentSize(opts.contentSize || cc.size(0, 0));
        root.addChild(node, opts.zOrder || 0);
        return node;
    },

    makeImageView: function(root, opts) {
        var rootSize = root.getContentSize();
        var center = cc.p(rootSize.width / 2, rootSize.height / 2);

        var img = new ccui.ImageView(opts.sprite, ccui.Widget.PLIST_TEXTURE);

        var baseSize = rootSize;
        if (opts.scale9Size) {
            img.ignoreContentAdaptWithSize(false);
            img.setScale9Enabled(true);
            img.setContentSize(opts.scale9Size);
            baseSize = opts.scale9Size;
        } else if (opts.contentSize) {
            img.setContentSize(opts.contentSize);
            baseSize = opts.contentSize;
        } else if (opts.scale) {
            img.setScale(opts.scale);
        }

        if (opts.scaleX) {
            img.setScaleX(opts.scaleX);
        }

        if (opts.scaleY) {
            img.setScaleY(opts.scaleY);
        }

        img.setAnchorPoint(opts.anchorPoint || cc.p(0.5, 0.5));

        var imgSize = img.getContentSize();

        switch (opts.resizeMode) {
            case this.RESIZE_STRETCH:
                img.setScale(baseSize.width / imgSize.width, baseSize.height / imgSize.height);
                break;

            case this.RESIZE_COVER:
                img.setScale(Math.max(baseSize.width / imgSize.width, baseSize.height / imgSize.height));
                break;

            case this.RESIZE_CONTAIN:
                img.setScale(Math.min(baseSize.width / imgSize.width, baseSize.height / imgSize.height));
                break;
        }

        img.setPosition(opts.position || center);

        root.addChild(img, opts.zOrder || 0);
        return img;
    },

    makeSprite: function(root, opts) {
        var img = new cc.Sprite("#" + opts.sprite);

        if (opts.size) {
            const contentSize = img.getContentSize();
            img.setScale(opts.size.width / contentSize.width, opts.size.height / contentSize.height);
        } else {
            img.setScale(opts.scale || 1);
        }

        img.setAnchorPoint(opts.anchorPoint || cc.p(0.5, 0.5));
        img.setPosition(opts.position || cc.p(0, 0));
        root.addChild(img, opts.zOrder || 0);
        return img;
    },

    makeText: function(root, opts) {
        var txt = new ccui.Text(opts.text, opts.font, opts.fontSize);
        txt.setScale(opts.scale || 1);
        txt.setAnchorPoint(opts.anchorPoint || cc.p(0.5, 0.5));
        txt.setPosition(opts.position || cc.p(0, 0));
        txt.setTextHorizontalAlignment(opts.horzAlign || cc.TEXT_ALIGNMENT_CENTER);
        txt.setTextVerticalAlignment(opts.vertAlign || cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        txt.setTextColor(opts.color || cc.color(255, 255, 255, 255));

        if (opts.ignoreContentAdaptWithSize != null) {
            txt.ignoreContentAdaptWithSize(opts.ignoreContentAdaptWithSize);
        }

        if (opts.size) {
            txt.setSize(opts.size);
        }

        if (opts.shadow) {
            txt.enableShadow(opts.shadowColor || cc.color(0, 0, 0, 255), opts.shadowOffset || cc.size(2, -2), 0);
        }

        if (opts.outline) {
            txt.enableOutline(opts.outlineColor || cc.color(0, 0, 0, 255), opts.outlineSize || 1);
        }

        if (opts.glow) {
            txt.enableOutline(opts.glowColor || cc.color(255, 255, 255, 255));
        }

        root.addChild(txt, opts.zOrder || 0);
        return txt;
    },

    makeButton: function(root, opts) {
        var btn = new ccui.Button();
        btn.loadTextures(opts.normal || "", opts.pressed || "", opts.disabled || "", ccui.Widget.PLIST_TEXTURE);
        btn.setScale(opts.scale || 1);
        btn.setAnchorPoint(opts.anchorPoint || cc.p(0.5, 0.5));
        btn.setPosition(opts.position || cc.p(0, 0));

        if (opts.listener) {
            btn.addTouchEventListener(opts.listener, opts.listenerTarget);
        }

        root.addChild(btn, opts.zOrder || 0);
        return btn;
    },

    makeSlider: function (root, opts)
    {
        opts = Object.assign({
            barTexture:"",
            buttonTexture:"",
            buttonTextureClicked:"",
            progressBarTexture:"",
            touchEnable:true,
            anchorPoint:cc.p(0.5,0.5),
            position:cc.p(0,0),
            scale:1.0,
            onChange:function(){},
            onEvent:function(){},
        },opts);
        var slider = new ccui.Slider();
        slider.setTouchEnabled(true);
        slider.setScale(opts.scale);
        slider.setAnchorPoint(opts.anchorPoint);
        slider.setPosition(opts.position);
        slider.loadBarTexture(getResourceAlias(opts.barTexture));
        slider.loadSlidBallTextures(getResourceAlias(opts.buttonTexture), getResourceAlias(opts.buttonTextureClicked), "");
        slider.loadProgressBarTexture(getResourceAlias(opts.progressBarTexture));
        slider.addEventListener((sender,type)=>{
            switch (type) {
                case ccui.Slider.EVENT_PERCENT_CHANGED:
                    opts.onChange(sender.getPercent().toFixed(0));
                    break;
            }
            opts.onEvent(sender, type);
        });
        root.addChild(slider);
        return slider;
    },

    makeMaskedSprite: function(root, opts) {
        var spr = new cc.Sprite("#" + opts.sprite);
        spr.setScale(opts.scale || 1);
        var maskNode = cc.Sprite.create("#" + opts.mask);
        maskNode.setScale(opts.scale || 1);
        var clipping = cc.ClippingNode.create(maskNode);
        clipping.setAlphaThreshold(0.5);
        clipping.addChild(spr, 0);

        clipping.setAnchorPoint(opts.anchorPoint || cc.p(0.5, 0.5));
        clipping.setPosition(opts.position || cc.p(0, 0));
        root.addChild(clipping, opts.zOrder || 0);
        return spr;
    },

    makeListView: function(root, opts) {
        var listView = ccui.ListView.create();
        listView.setDirection(opts.direction || ccui.ScrollView.DIR_VERTICAL);
        listView.setAnchorPoint(opts.anchorPoint || cc.p(0.5, 0.5));
        listView.setPosition(opts.position || cc.p(0, 0));
        listView.setBounceEnabled(true);
        listView.setContentSize(opts.contentSize || cc.size(0, 0));
        listView.setClippingType(opts.clippingType || ccui.Layout.CLIPPING_SCISSOR);
        listView.setClippingEnabled(true);
        root.addChild(listView, opts.zOrder || 0);
        return listView;
    },

    makeProgressBar: function(root, opts) {
        var bar = ccui.LoadingBar.create();
        bar.loadTexture(opts.sprite, ccui.Widget.PLIST_TEXTURE);

        if (opts.scale) {
            bar.setScale(opts.scale);
        }

        if (opts.scaleX) {
            bar.setScaleX(opts.scaleX);
        }

        if (opts.scaleY) {
            bar.setScaleY(opts.scaleY);
        }

        bar.setPosition(opts.position || cc.p(0, 0));
        bar.setPercent(opts.percent || 0);
        root.addChild(bar, opts.zOrder || 0);
        return bar;
    },

    relativeTo: function(root, relative, x, y) {
        const relativeHorz = (relative >> 2) & 0b11;
        const relativeVert = relative & 0b11;

        const rootContentSize = root.getContentSize();

        switch (relativeHorz) {
            case 1:
                x = rootContentSize.width / 2 + x;
                break;
            case 2:
                x = rootContentSize.width - x;
                break;
        }

        switch (relativeVert) {
            case 0:
                y = rootContentSize.height - y;
                break;
            case 1:
                y = rootContentSize.height / 2 + y;
                break;
        }

        return cc.p(x, y);
    }
};
