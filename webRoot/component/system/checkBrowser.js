/*
 *$Author: lokya
 *$Date: 2017/11/12 10:57:01
 *$Revision: 1.00
 *$Purpose: 通用判断当前浏览器版本和IE版本
 *参考网站：http://www.jianshu.com/p/26676df58e1a  --ps:致敬作者
 *			https://gist.github.com/yuxingxin/117828317dd89436ec03f15fcbb26479  --ps:致敬作者
 			https://segmentfault.com/a/1190000011316167 --ps:致敬作者
 *缺点:不支持IE6以下的判断
 */

var ckBrowser = {
	//检测浏览器类型
	checkBrowser:function(){
		var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    	var isOpera = userAgent.indexOf("Opera") > -1; //判断是否Opera浏览器
    	var isIE = window.ActiveXObject || "ActiveXObject" in window; //判断是否IE浏览器 
    	var isEdge = userAgent.indexOf("Edge") > -1; //判断是否IE的Edge浏览器
    	var isFF = userAgent.indexOf("Firefox") > -1; //判断是否Firefox浏览器 
    	var isSafari = userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") == -1; //判断是否Safari浏览器 
    	var isChrome = userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Safari") > -1&&!isEdge; //判断Chrome浏览器		 
		if (isIE){ 
			var reIE = new RegExp("MSIE (\\d+\\.\\d+);"); 
				reIE.test(userAgent); 
			var fIEVersion = parseFloat(RegExp["$1"]); 
			if(userAgent.indexOf('MSIE 6.0')!=-1){
				return "IE6";
			}else if(fIEVersion == 7) 
			{ 
				return "IE7";
			} 
			else if(fIEVersion == 8) 
			{ 
				return "IE8";
			} 
			else if(fIEVersion == 9) 
			{ 
				return "IE9";
			} 
			else if(fIEVersion == 10) 
			{ 
				return "IE10";
			} 
			else if(userAgent.toLowerCase().match(/rv:([\d.]+)\) like gecko/)){ 
			  	return "IE11";
			} 
			else
			{ 
				return "0";
			}//IE版本过低
		}//isIE end 				
		if (isFF) {
			return "Firefox";
		}
		if (isOpera) {
			return "Opera";
		}
		if(isEdge){
			return "Edge";
		}
		if(isSafari){
			return "Safari";
		}
		if(isChrome){
			return "Chrome";
		}
		return 0;
	},
	//检测是不是IE浏览器
	browserIsIE:function(){
		if (!!window.ActiveXObject || "ActiveXObject" in window){
			return true;
		}else{
			return false;
		}
	},
	//返回浏览器的版本
	//该特性已经从 Web 标准中删除，虽然一些浏览器目前仍然支持它，但也许会在未来的某个时间停止支持，请尽量不要使用该特性。
	browserVersion:function(){
		if(navigator.appVersion){
			return navigator.appVersion
		}
	},
	//返回浏览器的所在平台
	browserplatform:function(){
		return navigator.platform
	},
	//判断手机类型
	checkPhone:function(){
		var sUserAgent = navigator.userAgent.toLowerCase();
		if(sUserAgent.match(/ipad/i) == "ipad"){
			return "Ipad";
		}
		if(sUserAgent.match(/iphone os/i) == "iphone os"){
			return "IphoneOs"
		}
		if(sUserAgent.match(/midp/i) == "midp"){
			return "Midp"
		}
		if(sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4"){
			return "Uc7"
		}
		if(sUserAgent.match(/ucweb/i) == "ucweb"){
			return "Uc"
		}
		if(sUserAgent.match(/android/i) == "android"){
			return "Android"
		}
		if(sUserAgent.match(/windows ce/i) == "windows ce"){
			return "WindowsCe"
		}
		if(sUserAgent.match(/windows mobile/i) == "windows mobile"){
			return "WindowsMobile"
		}
		return 0;
	},
	//判断是否是手机
	browserIsPhone:function(){
		if(checkPhone()){
			return true;
		}else{
			return false;
		}
	}
}
