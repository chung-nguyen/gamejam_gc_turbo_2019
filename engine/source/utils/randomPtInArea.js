module.exports = {
    circle: function (pt, radius) {
        const vd = cc.p(Math.random() * 2 - 1, Math.random() * 2 - 1);        
        if (cc.pLengthSQ(vd) > 0.0001) {
            const dir = cc.pNormalize(vd);
            const l = Math.random() * radius;
            return cc.p(pt.x + dir.x * l, pt.y + dir.y * l);
        }

        return pt;
    },

    quad: function (lt, rt, lb, rb) {
        const vd1 = cc.p(lb.x - lt.x, lb.y - lt.y);        
        const vstep1 = Math.random() * cc.pLength(vd1);
        const vdir1 = cc.pNormalize(vd1);

        const vd2 = cc.p(rb.x - rt.x, rb.y - rt.y);        
        const vstep2 = Math.random() * cc.pLength(vd2);
        const vdir2 = cc.pNormalize(vd2);        

        const x1 = lt.x + vdir1.x * vstep1;
        const y1 = lt.y + vdir1.y * vstep1;
        const x2 = rt.x + vdir2.x * vstep2;
        const y2 = rt.y + vdir2.y * vstep2;

        const hd = cc.p(x2 - x1, y2 - y1);
        const hstep = Math.random() * cc.pLength(hd);
        const hdir = cc.pNormalize(hd);
        
        return cc.p(x1 + hdir.x * hstep, y1 + hdir.y * hstep);
    }
};