/*
 * config 打开窗口 id title url
 * 修复
 * 
 */
;function showPageAd(config){
	var page, con;
	
	//打开窗口js
	if (config && config.id){
		page = config.url;
		try{
			con = document.getElementById(config.id).children[0].children[1].children[0].children[0];
		}catch(e){
			return;
		}
	}else if (!window.showAdFlag){
		
		//页面广告js
		page = window.location.href;
		con = document.body;
		window.showAdFlag = true;
		//main.screen 特殊 要查询所有的广告
		if (page.indexOf('main.screen') > -1){
			getPageAdDatas();
		}
	}
	
	if (!page || !con){
		return;
	}
	
	//获取数据 所有页面广告  页面广告
	var adsArray = window.adsArray = window.adsArray || [];
	var allPageAds = handGlobal.topParent.adsArray || window.adsArray;
	var pageAds = findAdDatasByPage(allPageAds, page);
	
	if (pageAds.length < 1){
		if (handGlobal.topParent.pageName != 'main.screen'){
			getPageAdDatas(page);
		}
	}else{
		showAdContent(pageAds);
	}
	
	//显示广告内容
	function showAdContent(datas){
		if (con.children.length < 2){
			setTimeout(
					function(){
						showAdContent(datas);
					}, 20);
			return;
		}
		var l = datas.length;
		var html, div, style, data;
		
		for (var i = 0; i < l; i++){
			data = datas[i];
			html = "<a target='_blank' onclick='recordViewAd(event);' class='ad-containter' href='" + (data.ad_href || "") + "'>";
			html += "<div class='ad-containter-close'><span title='关闭' onclick='removeAdContent(event);'><i class='icon-remove-sign'></i></span></div>";
			html += data.ad_content + "</a>";
			div = {dom:jDawn.renderElement("DIV", "ad-content", html), data:data};
			style = div.dom.style;
			div.dom.data = data;
			
			if (config){
				style.position = "absolute";
				if (data.position == "absolute"){
					con = document.getElementById(config.id).children[0].children[1].children[0].children[0];
				}else{
					con = document.getElementById(config.id);
				}
			}else{
				style.position = data.position || "absolute";
			}
			
			if ((!data.top) && (!data.bottom)){
				style.top = "0px";
			}else{
				style.bottom = (data.bottom) ? (data.bottom + "px") : "";
				style.top = (data.top) ? (data.top + "px") : "";
			}
			
			if ((!data.right) && (!data.left)){
				style.left = "0px";
			}else{
				style.right = (data.right) ? (data.right + "px") : "";
				style.left = (data.left) ? (data.left + "px") : "";
			}
			
			style.filter = 'alpha(opacity=' + ((data.alpha || 1) * 100)+')';
			style.opacity = data.alpha || 1;
			style.zIndex = (data.zindex || "200");
			con.appendChild(div.dom);
			
			if (data.time){
				hideAdDom(div.dom, data.time);
			}
		}
	}
	//查找页面所有数据
	function findAdDatasByPage(adDatas, page){
		var rslt = [];
		if (adDatas && adDatas.length > 0){
			var l = adDatas.length, data;
			for (var i = 0; i < l; i ++){
				data = adDatas[i];
				if (page.indexOf(data.page) > -1){
					rslt.push(data);
				}
			}
		}
		return rslt;
	}
	
	//获取页面广告数据
	function getPageAdDatas(url){
		var data = url?{page:url}:null;
		ajax({
	        url: handGlobal.basePath + "/autocrud/ad.manage.config.getAllShowAds/query",              
	        type: "POST",        
	        data: data,
	        dataType: "json",
	        success: function (response, xml) {
	            //此处放成功后执行的代码
	        	console.log(response);
	        	if(!Ext.isEmpty((eval("("+response+")")).result)){
	        	var rslt = (eval("("+response+")")).result.record;
	        	if (!rslt){
	        		return;
	        	}
	        	if (!(rslt instanceof Array)){
	        		rslt = [rslt];
	        	}
	        	
        		var l = rslt.length;
        		for (var i = 0; i < l; i++){
        			adsArray.push(rslt[i]);
        		}
	        	showAdContent(findAdDatasByPage(rslt, page));
	        	}
	        },
	        fail: function (status) {
	            // 失败之后的数据
	        }
	    });
	}
};

//ajax请求
function ajax(options) {
    options = options || {};
    options.type = (options.type || "GET").toUpperCase();
    options.dataType = options.dataType || "json";
    var params = formatParams(options.data);

	var xhr = jDawn.getHTTPRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            var status = xhr.status;
            if (status >= 200 && status < 300) {
                options.success && options.success(xhr.responseText, xhr.responseXML);
            } else {
                options.fail && options.fail(status);
            }
        }
    }
    //连接 和 发送 - 第二步
    if (options.type == "GET") {
        xhr.open("GET", options.url + "?" + params, true);
        xhr.send(null);
    } else if (options.type == "POST") {
        xhr.open("POST", options.url, true);
        //设置表单提交时的内容类型
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send(params);
    }
}
//格式化参数
function formatParams(data) {
    var arr = [];
    for (var name in data) {
        arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
    }
    arr.push(("v=" + Math.random()).replace("."));
    return arr.join("&");
}

function removeAdContent(e){
	e = e || window.event;
	var tgr = e.target || e.srcElement;
	while(tgr.tagName.toUpperCase() != "A"){
		tgr = tgr.parentNode;
	}
	
	//阻止冒泡
	if (e.preventDefault){
		e.stopPropagation();
		e.preventDefault();
	}else{
		e.cancelBubble = true;
	}
	
	tgr.parentNode.removeChild(tgr);
}

function hideAdDom(dom, duration){
	var _dom = dom;
	var _style = dom.style;
	var _alpha = (dom.data.alpha || 1) * 100;
	var _tweenFun = jDawn.tween['Expo']['easeOut']; 
	var _timer = 0;
	var _delay = 10;
	/*
	 * t：current time（当前时间）；  
	 * b：beginning value（初始值）； 
	 * c： change in value（变化量）； 
	 * d：duration（持续时间）。
	 */
	var D = 0;
	var t = 0;
	var b = _alpha;
	var c = -1 * b;
	var d = parseInt(duration * 1000 / 30);
	d = d < 200 ? d : 300;
	function hideAd(){
		if(t < d){
			t++;
			D = parseInt(_tweenFun(t, b, c, d));
			_timer = setTimeout(hideAd, _delay);
			_style.filter = 'alpha(opacity=' + D +')';
			_style.opacity = (D / 100);
		}else{
			clearTimeout(_timer);
			dom.parentNode.removeChild(dom);
		}
	}
	_timer = setTimeout(hideAd, duration * 1000 - d * 10);
}

function recordViewAd(e){
	e = e || window.event;
	var tgr = e.target || e.srcElement;
	while(tgr.tagName.toUpperCase() != "A"){
		tgr = tgr.parentNode;
	}
	tgr = tgr.parentNode;
	
	ajax({
        url: handGlobal.basePath + "/autocrud/ad.manage.config.ad_ad_view/execute",              
        type: "POST",        
        data: tgr.data,
        dataType: "json",
        success: function (response, xml) {
        	//成功之后
        },
        fail: function (status) {
            // 失败之后的数据
        }
    });
}