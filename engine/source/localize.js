const _texts = {
    ok: {
        en: 'ok',
        vn: 'ok'
    },
    cancel: {
        en: 'cancel',
        vn: 'hủy'
    },
    yes: {
        en: 'yes',
        vn: 'có'
    },
    no: {
        en: 'no',
        vn: 'không'
    },
    instantPlay: {
        en: 'instant play',
        vn: 'chơi ngay'
    },
    option: {
        en: 'option',
        vn: 'tùy chọn'
    },
    help: {
        en: 'help',
        vn: 'hướng dẫn'
    },
    about: {
        en: 'about',
        vn: 'giới thiệu'
    },
    logout: {
        en: 'logout',
        vn: 'đăng xuất'
    },
    battle: {
        en: 'battle',
        vn: 'chiến'
    },
    train: {
        en: 'train',
        vn: 'luyện'
    },
    collect: {
        en: 'collect',
        vn: 'nhận thưởng'
    },
    level: {
        en: 'level',
        vn: 'cấp độ'
    },
    jackpot: {
        en: 'jackpot',
        vn: 'jackpot'
    },
    bet: {
        en: 'bet',
        vn: 'cược'
    },
    pleaseWait: {
        en: 'please wait',
        vn: 'vui lòng chờ'
    },
    noMoreBet: {
        en: 'no more bet',
        vn: 'không nhận cược'
    },
    blackjack_insurance: {
        en: 'insurance?',
        vn: 'insurance?'
    },
    pot: {
        en: 'pot',
        vn: 'pot'
    },
    total_bet: {
        en: 'total bet',
        vn: 'cược'
    },
    total_win: {
        en: 'total win',
        vn: 'thắng'
    },
    buy_in: {
        en: 'buy in',
        vn: 'tiền túi'
    },
    notEnoughMoney: {
        en: 'not enough cash',
        vn: 'không đủ tiền'
    },
    maxBetAlready: {
        en: 'max bet already',
        vn: 'không thể cược thêm'
    },
    inviteFriendMessage: {
        en: 'play this game',
        vn: 'play this game'
    },
    game_guide: {
        en: 'game guide',
        vn: 'hướng dẫn chơi'
    },
    option_setting: {
        en: 'setting',
        vn: 'tùy chỉnh'
    },
    option_notification: {
        en: 'notification',
        vn: 'thông báo'  
    },
    music: {
        en: 'music',
        vn: 'nhạc'
    },
    sound: {
        en: 'sound',
        vn: 'âm thanh'
    },
    vibration: {
        en: 'viration',
        vn: 'rung'
    },
    general_notification: {
        en: 'general',
        vn: 'trung tâm'
    },
    friends: {
        en: 'friends',
        vn: 'bạn bè'
    },
    friends_notification: {
        en: 'friends',
        vn: 'bạn bè'
    },
    option_account: {
        en: 'account',
        vn: 'tài khoản'
    },
    spin: {
        en: 'spin',
        vn: 'quay'
    },    
    ranking: {
        en: 'ranking',
        vn: 'xếp hạng'
    }
}

function get(key) {
    return _texts[key][currentLanguage];
}

function getCaps(key) {
    return _texts[key][currentLanguage].toUpperCase();
}

function getCapFirst(key) {
    var txt = _texts[key][currentLanguage];
    return txt.charAt(0).toUpperCase() + txt.slice(1);
}

function getCapsColon(key) {
    return _texts[key][currentLanguage].toUpperCase() + ':';
}

function shortenText(text, maxLength) {
    text = text || '';
    return text.length <= maxLength ? text : text.substring(0, maxLength) + '...';
}

module.exports = {
    get,
    getCaps,
    getCapFirst,
    shortenText,
    getCapsColon
}