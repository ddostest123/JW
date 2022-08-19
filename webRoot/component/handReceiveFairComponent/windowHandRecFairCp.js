/*
 * 使用说明 使用div标签 名称为'handReceiveFairComponent' 即可
 *   <div name="handReceiveFairComponent" title_text="可收展组件" color="red" listValueArray="**,**,**" closeFunc="">
 *	   <div>
       </div>
 *   </div>
 */
window.handRecFaircp = function(obj) {
	var handRecFair = {
		listShowFlag : false,
		listShowHeight : null,
		listEveryStep : null,
		listCounts : 1,
		listStepTime : 50,
		listInterval : null,
		downUlShowFlag : false,
		titleText : null,
		classColor : null,
		listValueArray : null,
		bodyPaddingValue : null
	};
	handAddReceiveFairComp(obj, 0);
	function handAddReceiveFairComp(obj, index) {
		var parent = obj;
		var children = parent.children;
		var num = children.length;
		handRecFair.titleText = getAttribute(obj, 'title_text');
		handRecFair.classColor = getAttribute(obj, 'color');
		handRecFair.listValueArray = getAttribute(obj, 'comlistvalue').split(
				',');
		handRecFair.listShowFlag = false;
		handRecFair.downUlShowFlag = false;
		parent.className = 'handRecFairCp_widget ' + handRecFair.classColor;
		children[0].className = 'handRecFairCp_widget_body';
		createHeadChidlren();
		addClearBothDiv(parent);
		var rightIs = children[0].children[1].children;
		rightIs[0].onclick = listToggleFun;
		rightIs[1].onclick = handRecCompClose;
		rightIs[2].onclick = comListToggleFun;
		obj.parentNode.addEventListener('click', handAreaOutClick, true);
	}

	function createHeadChidlren() {
		var div = window.document.createElement('div');
		div.className = 'handRecFairCp_widget_title';
		var html = '<div class="title_left"><i class="fa icon-pencil"></i><div>'
				+ handRecFair.titleText + '</div></div>';
		var ulHtml = '<ul>';
		for ( var i = 0; i < handRecFair.listValueArray.length; i++) {
			ulHtml += '<li index="' + i + '">' + handRecFair.listValueArray[i]
					+ '</li>';
		}
		ulHtml += '</ul>';
		html += '<div class="title_right"><i class="fa icon-chevron-up"></i><i class="fa icon-remove"></i><i class="fa icon-align-justify"></i>';
		html += ulHtml + '</div>';
		div.innerHTML = html;
		obj.insertBefore(div, obj.children[0]);
	}

	function addClearBothDiv(parent) {
		var div = window.document.createElement('div');
		div.style.clear = 'both';
		parent.appendChild(div);
	}

	function getAttribute(obj, name) {
		var value = obj.getAttribute(name);
		if (typeof (value) == undefined) {
			return '';
		}
		return value;
	}

	function listToggleFun() {
		var item = obj.children[1];
		if (handRecFair.listShowFlag) {
			handRecFair.listInterval = setInterval(function() {
				listShowToggle(item);
			}, handRecFair.listStepTime);
			this.className = 'fa icon-chevron-up';
		} else {
			handRecFair.listShowHeight = item.offsetHeight;
			handRecFair.listEveryStep = handRecFair.listShowHeight
					/ handRecFair.listCounts;
			handRecFair.listInterval = setInterval(function() {
				listHideToggle(item);
			}, handRecFair.listStepTime);
			this.className = 'fa icon-chevron-down';
		}
	}

	function listHideToggle(item) {
		var height = item.offsetHeight;
		if (height <= 0) {
			clearInterval(handRecFair.listInterval);
			handRecFair.listShowFlag = true;
		} else {
			item.style.height = height - handRecFair.listEveryStep + 'px';
		}
	}

	function listShowToggle(item) {
		var height = item.offsetHeight;
		if (height >= handRecFair.listShowHeight) {
			clearInterval(handRecFair.listInterval);
			handRecFair.listShowFlag = false;
		} else {
			item.style.height = height + handRecFair.listEveryStep + 'px';
		}
	}

	function handRecCompClose() {
		var closeFunc = obj.getAttribute("closeFunc");
		obj.parentNode.removeChild(obj);
		if (closeFunc != '') {
			eval(closeFunc);
		}
	}

	function comListToggleFun() {
		var item = this.nextSibling;
		var display = item.style.display;
		if (handRecFair.downUlShowFlag) {
			item.style.display = 'none';
			handRecFair.downUlShowFlag = false;
		} else {
			item.style.display = 'block';
			handRecFair.downUlShowFlag = true;
		}
	}

	function handAreaOutClick(e) {
		var children = obj.children[0].children[1].children
		var ul_item = children[3];
		var _this = children[2];
		if (handRecFair.downUlShowFlag) {
			var pos_x = e.clientX;
			var pos_y = e.clientY;
			var p_top = offsetTop_toBody(_this);
			var p_bottom = p_top + _this.offsetHeight;
			var p_left = offsetLeft_toBody(_this);
			var p_right = p_left + _this.offsetWidth;
			if (pos_x > p_right || pos_x < p_left || pos_y < p_top
					|| pos_y > p_bottom) {
				ul_item.style.display = 'none';
				handRecFair.downUlShowFlag = false;
			}
		}
	}
	// 利用js的offsetLeft算出目标距离最左边的距离
	function offsetLeft_toBody(_this) {
		var offset_left = _this.offsetLeft;
		while (_this.offsetParent != null) {
			offset_left += (_this.offsetParent.offsetLeft != null) ? _this.offsetParent.offsetLeft
					: 0;
			_this = _this.offsetParent;
		}
		return offset_left;
	}
	// 利用js的offsetTop算出目标距离最上边的距离

	function offsetTop_toBody(_this) {
		var offset_top = _this.offsetTop;
		while (_this.offsetParent != null) {
			offset_top += (_this.offsetParent.offsetTop != null) ? _this.offsetParent.offsetTop
					: 0;
			_this = _this.offsetParent;
		}
		return offset_top;
	}
};