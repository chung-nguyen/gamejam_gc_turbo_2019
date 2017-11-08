function commafy(num) {
    var parts = ('' + (num < 0 ? -num : num)).split("."), s = parts[0], L, i = L = s.length, o = '';
    while (i--) {
        o = (i === 0 ? '' : ((L - i) % 3 ? '' : ','))
        + s.charAt(i) + o
    }
    return (num < 0 ? '-' : '') + o + (parts[1] ? '.' + parts[1] : '');
}

function padZeros(value, count) {
    let res = (value || 0).toString();
    let pad = '';
    for (var i = 0; i < count - res.length; ++i) {
        pad += '0';
    }
    return pad + res;
}

const formatMoney = (value, depth) => {
    let n = value || 0;
    let res;

    if (n < 1) {
        return '0';
    }

    res = commafy(Math.floor(n));
    if (n != 0) {
        n = Math.floor((n % 1) * 1000);
        res += ',' + padZeros(n, 3);
    }    
    
    if (!depth || res.length <= depth) {
        return res;
    }

    n = value || 0;
    res = commafy(Math.floor(n)) + 'k';
    if (!depth || res.length <= depth) {
        return res;
    }

    res = commafy(Math.floor(n / 1000)) + 'tr';
    if (!depth || res.length <= depth) {
        return res;
    }

    res = commafy(Math.floor(n / 1000000)) + 'tỷ';    
    return res;    
}

export default formatMoney;