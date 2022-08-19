/*
 * 使用说明 为了解决 input的placeHolder的兼容问题 ie10以下
 */
(
	function (){
		addInnerListenerFunc(window, 'onload', setPlaceHolder)
		function setPlaceHolder(){
	        var IEVersion = getIEVersion();
	        if (IEVersion > 9){
	        	return;
	    	}
	    	var inputsArray = window.document.getElementsByTagName('INPUT');
	    	var length = inputsArray.length, attribute, input, type, func;
	    	for (var i = 0; i < length; i++ ){
	    	    input = inputsArray[i];
	    	    attribute = input.getAttribute('placeholder');
	    	    type = input.getAttribute('type');
	    	    if (attribute){
	    	        if(type == 'password'){
	    	        	addInnerListenerFunc(input, 'onblur', onInputLoseFocuse);
	    	        	addInnerListenerFunc(input, 'onfocus', onFocuseInput);
	    	            input.inputType = 'password';
	    	            input.textStatus = 1;
	    	            var showInput = window.document.createElement('INPUT');
	    	            showInput.type = 'text';
	    	            showInput.inputType = "password";
	    	            showInput.onfocus = onFocuseInput;
	    	            showInput.replaceObj = input;
	    	            showInput.textStatus = 0;
	    	            showInput.value = attribute;
	    	            input.replaceObj = showInput;
	    	            input.parentNode.appendChild(showInput);
	        	    	if(!input.value){
	        	    	    showInput.style.display = 'block';
	        	    	    input.style.display = 'none';
	        	    	}else{
	        	    	    showInput.style.display = 'none';
	        	    	}
	    	        }else if(type == 'text'){
	    	        	addInnerListenerFunc(input, 'onblur', onInputLoseFocuse);
	    	        	addInnerListenerFunc(input, 'onfocus', onFocuseInput);
	    	            input.inputType = 'text';
	    	        	if(!input.value){
	        	    	    input.value = attribute;
	        	    	    input.textStatus = 0;
	        	    	}else{
	        	    	    input.textStatus = 1;
	        	    	}
	    	        }
	    	    }
	    	}
	    }
		
		function getIEVersion() {
			var rv = 1000;
			if(navigator.appName == 'Microsoft Internet Explorer') {
			    var ua = navigator.userAgent;
			    var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
	
			    if(re.exec(ua) != null) {
			    	rv = parseFloat( RegExp.$1 );
			    }
			}
			return rv;
		}
		
		function addInnerListenerFunc(tgr, listenerName, newFunc){
	        var oldFunc = tgr[listenerName];
		  	if (typeof oldFunc != 'function') {
		  	    tgr[listenerName] = newFunc;
		  	} else { 
		  	    tgr[listenerName] = function (){
		  	        oldFunc();
		  	        newFunc();
		  	    };
			}
	    }
	    
	    function onInputLoseFocuse(e){
	        e = e || event;
			var input = e.currentTarget || e.srcElement;
			while (input.nodeName != 'INPUT'){
				input = input.parentNode;
			}
			if (!input.value){
				if (input.inputType == 'password'){
				    input.replaceObj.style.display = 'block';
		    	    input.style.display = 'none';
				}else{
				    input.value = input.getAttribute('placeholder');
					input.textStatus = 0;
				}
			}else{
	    	    input.textStatus = 1;
	    	}
	    }
	    
	    function onFocuseInput(e){
	        e = e || event;
			var input = e.currentTarget || e.srcElement;
			while (input.nodeName != 'INPUT'){
				input = input.parentNode;
			}
			if (input.textStatus == 0){
			    if(input.inputType == 'text'){
			        input.value = '';
					input.textStatus = 0;
			    }else if(input.inputType == 'password'){
				    input.replaceObj.style.display = 'block';
		    	    input.style.display = 'none';
				    input.replaceObj.focus();
				}
			}
	    }
    }
)();