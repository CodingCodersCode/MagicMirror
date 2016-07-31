var ai = {
	aiLocation: '.ai',
    sayingLocation: '.saying',
    url: 'ws://localhost:8080/server/websocket',
	fadeInterval: config.ai.fadeInterval,
    cleanInterval: config.ai.cleanInterval,
    mmAvatar: 'lmm.jpg',
    defAvatar: 'avatar.png',
    sayingTime: new Date(),
    intervalId : null
}

ai.saying = function (data) {
    
    var dt_head = '<dt><image class="avatar ';
    var dt_mid1 = '" src="resources/images/';
    var dt_mid2 = '" /><div class="words ';
    var dt_mid3 = '">';
    var dt_tail = '</div><br class="clear" /></dt>';
    var avatar = ai.mmAvatar;
    var words = data.slice(2);
    var loc = 'fleft';
    
    var line = dt_head + loc + dt_mid1 + avatar + dt_mid2 + loc + dt_mid3 + words + dt_tail;
    /*
     * 接收数据解析：
     * 0 —— AI
     * 1 —— 用户
     * 2 —— AI 返回超链接
     */
    switch (data[0]) {
        case '0':
            break;
        case '1':
            avatar = ai.defAvatar;
            loc = 'fright';
            line = dt_head + loc + dt_mid1 + avatar + dt_mid2 + loc + dt_mid3 + words + dt_tail;
            break;
        case '2':
            line = '<dt><IFRAME name="XXX" frameborder=0 width=390px height=480px src="' + words + '"></IFRAME></dt>';
            break;
        default:
            console.log('不支持的数据:' + data);
            break;
    }
    
    $(ai.sayingLocation).append(line);
    ai.scrollWords();
    ai.sayingTime = new Date();
}

ai.scrollWords = function() {
    var height = $(ai.sayingLocation).outerHeight();
    var offset = 795 - height;
    if (offset < 0) {
        $(ai.sayingLocation).animate({
            marginTop: offset + 'px',
        }, ai.fadeInterval);
    }
}

ai.clearWords = function () {
    var nowTime = new Date();
    if (nowTime - ai.sayingTime > ai.cleanInterval) {
        $(ai.sayingLocation).empty();
        $(ai.sayingLocation).css({"marginTop": "0"});
    }
}

ai.init = function () {
    new websocket(this.url, this.saying);
    
    this.intervalId = setInterval(function() {
        this.clearWords();
    }.bind(this), this.cleanInterval);
    
    // 增加定时断线重连机制？
}