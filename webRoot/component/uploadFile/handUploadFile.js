//container页面容器
//imgLimit对象属性
//allowImgFileSize 允许上传图片文件的大小 0为无限制 单位：KB
//allowImgWidth 允许上传的图片的宽度  单位：px(像素)
//allowImgHeight 允许上传的图片的高度  单位：px(像素);
var handUplaodFile = {
	init:null,
	sequence:0,
	callBackArray:[],
	data:{},
	file:null,
	submit:null,
	iframes:null,
	iframesPool:[],
	iframe_name:'upload_temp_iframe'
};

handUplaodFile.createIframe = function(id){
	if (handUplaodFile.iframesPool.length > 0){
		return handUplaodFile.iframesPool.pop();
	}
	iframe = handUplaodFileiframe =document.createElement('iframe');
	iframe.src = '';
	var iframeName = handUplaodFile.iframe_name + '_' + id;
	iframe.name = iframeName;
	iframe.style.display = 'none';
	document.body.appendChild(iframe);
	return iframe;
}
handUplaodFile.submit = function(form, action, returnFunc, name){
    form.encoding = 'multipart/form-data';
    form.enctype = 'multipart/form-data';
    handUplaodFile.sequence ++;
    var iframe = handUplaodFile.createIframe(handUplaodFile.sequence);
    form.target = iframe.name;
    form.method = 'post';
    handUplaodFile.callBackArray[handUplaodFile.sequence] = {func:returnFunc, name:name, iframe:iframe};
    if (action.indexOf('?') > -1){
    	form.action = action + '&request_id=' + handUplaodFile.sequence;
    }else{
    	form.action = action + '?request_id=' + handUplaodFile.sequence;
    }
    form.submit();
};
function callBack(id, url, success, msg){
	var callBackObj = handUplaodFile.callBackArray[id];
	var iframesPool = handUplaodFile.iframesPool;
	if (iframesPool.length < 10){
		iframesPool.push(callBackObj.iframe);
	}else{
		document.body.removeChild(callBackObj.iframe);
	}
	
	if (callBackObj.func){
		callBackObj.func(callBackObj.name, success, msg, url);
	}
	delete handUplaodFile.callBackArray[id];
}