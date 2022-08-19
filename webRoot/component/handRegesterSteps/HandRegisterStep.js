var HandRegesterStep = {
	currentStep:1,
	totalStep:0,
	htmlObj:undefined,
	initFunc:Function,
	spanArray:[],
	spanContent:undefined,
	width:190,
	height:37
};

HandRegesterStep.initFunc = function(totalSteps, currentStep, div_id, stepsName, width, url){
	if (width != undefined){
		HandRegesterStep.width = width;
		/*HandRegesterStep.height = 37 * width / 190;*/
		HandRegesterStep.height = 38;
		if (HandRegesterStep.height < 34){
			HandRegesterStep.height = 34;
		}
	}
	
	
	HandRegesterStep.currentStep = currentStep;
	HandRegesterStep.totalStep = totalSteps;
	HandRegesterStep.htmlObj = window.document.getElementById(div_id);
	HandRegesterStep.spanContent = stepsName;
	currentStep --;
	
	var div, span, divBack, divStep, img, w = HandRegesterStep.width, h = HandRegesterStep.height, totalW, singleW;
	totalW = 20 + (totalSteps * w - totalSteps * 30);
	singleW = totalW / totalSteps;
	divBack = window.document.createElement('DIV');
	divStep = window.document.createElement('DIV');
	divBack.className = 'step-back-img';
	divStep.className = 'step-title-content';
	
	HandRegesterStep.htmlObj.appendChild(divBack);
	HandRegesterStep.htmlObj.appendChild(divStep);
	
	for(var i = 0; i < totalSteps; i ++){
		img = window.document.createElement('IMG');
		div = window.document.createElement('DIV');
		span = window.document.createElement('SPAN');
		if(i == currentStep){
			div.className = 'step-icon';
			img.className = 'step-img-icon';
			span.className = 'current-step-title';
			img.src = url + '/component/handRegesterSteps/last.png';
		}else if(i > currentStep){
			div.className = 'step-icon';
			img.className = 'step-img-icon';
			span.className = 'step-title';	
			img.src = url + '/component/handRegesterSteps/next.png';
		}else{
			div.className = 'step-icon';
			img.className = 'step-img-icon';
			span.className = 'step-title';	
			img.src = url + '/component/handRegesterSteps/last.png';
		}
		span.innerHTML = stepsName[i];
		span.style.width = (singleW - 15) + 'px';
		span.style.paddingLeft = '15px';
		div.style.zIndex = 10 - i;
		img.style.width = w + 'px';
		div.style.width = w + 'px';
		
		if (i > 0 ){
			div.style.left = (i * w - i * 30) + 'px';
		}else{
			div.style.left = '0px';
		}
		
		div.appendChild(img);
		divBack.appendChild(div);
		divStep.appendChild(span);
		img.height = h;
	}
	
	divBack.style.width = totalW + 'px';
	divStep.style.width = totalW + 'px';
}
