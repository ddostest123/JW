/*
 * 使用说明 使用div标签 名称为'HandRegisterCategory' '
 *  <div name="HandRegisterCategory">
 *  </div>
 *  功能：新修改为2级联动
 * 	修改人:lokya
 * 	修改时间:2017.09.28
 */
(function() {

	var handRegCate = {
		parent : null,
		data : fnd_registed_category,
		secondDiv : null,
		onSelectLi : null,
		onSelectFlag : false,
		selectLi : null,
		itemIdArray : [],
		loadFunction : null,
		secondMenuDiv : null
	};
	var documentAll = document.all;
	// 判断浏览器差异
	if (documentAll) {
		// ie下
		for (var i = 0; i < documentAll.length; i++) {
			if (documentAll[i].getAttribute('name') == 'HandRegisterCategory') {
				var objList = [];
				objList.push(documentAll[i]);
				handRegCate.parent = documentAll[i];
				addRegisterCategory(documentAll[i]);
			}
		}
	} else {
		// 非ie下
		var objList = window.document.getElementsByName('HandRegisterCategory');
		for (var i = 0; i < objList.length; i++) {
			handRegCate.parent = objList[i];
			addRegisterCategory(objList[i]);
		}
	}

	function addRegisterCategory(obj) {
		var parent = obj;
		parent.className = 'handCategory';
		// 建立加载完毕回调事件
		handRegCate.loadFunction = obj.getAttribute('load');
		// 建立prompt
		var promptSpan = createElement('span', '', '景旺主营品类:', parent);
		// 建立input
		var input = createElement('input', '', '', parent);
		input.setAttribute('readOnly', 'true');
		// 设置主选择框内容
		addMainDiv();
		// input点击
		input.onclick = function() {
			var div = document.getElementById('handRegistCate_mainDiv_id');
			if (div.style.display == 'block') {
				handRegisterCancel();
				// div.style.display = 'none';
				handRegisterCloseWin();
			} else {
				div.style.display = 'block';
			}
		}
		var target = document.body;
		if (target.addEventListener) {
			// 监听IE9，谷歌和火狐
			target.addEventListener('click', function(e) {
				e = e || window.event;
				handRegisterBodyOutClick(e);
			}, true);
		} else if (target.attachEvent) {
			target.attachEvent('onclick', function(e) {
				e = e || window.event;
				handRegisterBodyOutClick(e);
			});
		} else {
			target["onclick"] = function(e) {
				e = e || window.event;
				handRegisterBodyOutClick(e);
			};
		}

	}

	function createElement(eType, className, html, parent) {
		var div = document.createElement(eType);
		div.className = className;
		if (html != '' && html != null) {
			div.innerHTML = html;
		}
		parent.appendChild(div);
		return div;
	}

	function addMainDiv() {
		// 一级菜单
		var div = createElement('div', 'handRegistCategory-main-div', '',
				handRegCate.parent);
		div.id = 'handRegistCate_mainDiv_id';
		// 设置二级菜单显示框
		// var secondMenuDiv = createElement('div','','',handRegCate.parent);
		// secondMenuDiv.id = 'handRegistCate_secondDiv_id';
		// handRegCate.secondDiv = secondMenuDiv;
		// 标题ul
		var mainUl = createElement('ul', '', '', div);
		var index = 1;
		for (var i = 0; i < handRegCate.data.length; i++) {
			if (handRegCate.data[i].parent_id == null
					|| handRegCate.data[i].parent_id == '-1') {
				var li = createElement('li', '', '', mainUl);
				var html = '<span>' + handRegCate.data[i].description
						+ '</span><i class="icon-caret-right"></i>';
				li.setAttribute('index', index);
				li.setAttribute('item_id', handRegCate.data[i].item_id);
				li.setAttribute('content_id', 'handRegistCate_secondDiv_id_'
						+ index);
				li.innerHTML = html;
				index++;
			}
		}
		// 设置一级鼠标事件
		for (var i = 0; i < mainUl.children.length; i++) {
			var id = (mainUl.children[i]).getAttribute('content_id');
			var _d = document.getElementById(id);
			mainUl.children[i].onmouseover = function() {
				handRegisted_cell_click(this, "");
			}
		}
		// 完成加载
		eval(handRegCate.loadFunction);
	}

	function handRegisterGetId(id) {
		return document.getElementById(id);
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

	function addNextDiv(_this) {
		var _d = handRegisterGetId('handRegistCate_NextDiv_id');
		if (_d) {
			_d.parentNode.removeChild(_d);
		}
		var div = createElement('div', 'handRegistCategory-next-div', '', _this);
		div.id = 'handRegistCate_NextDiv_id';
		var ul = createElement('ul', '', '', div);
		var _div = createElement('div', 'regitst-bottom', '', div);
		var allInput = document.createElement('input');
		allInput.setAttribute('type', 'checkbox');
		_div.appendChild(allInput);
		var inputSpan = createElement('span', '', '全选', _div);
		var buttonConfirm = createElement('button', 'btn-confirm', '确定', _div);
		var buttonCancel = createElement('button', 'btn-cancel', '取消', _div);
		allInput.onclick = handRegisterSelectAllLi;
		buttonConfirm.onclick = handRegisterConfirm;
		buttonCancel.onclick = handRegisterCancel;
	}

	function handRegisted_cell_click(_this, type) {
		handRegCate.onSelectFlag = true;
		addNextDiv(_this.parentNode.parentNode);
		var left = _this.offsetLeft;
		var top = _this.offsetTop;
		var div = handRegisterGetId('handRegistCate_NextDiv_id');
		div.style.display = 'block';
		handRegCate.selectLi = _this;
		var item_id = _this.getAttribute('item_id');
		var ul = div.children[0];
		for (var i = 0; i < handRegCate.data.length; i++) {
			if (handRegCate.data[i].parent_id == item_id) {
				var li = createElement('li', '', '', ul);
				li.setAttribute('item_id', handRegCate.data[i].item_id);
				var input = document.createElement('input');
				input.setAttribute('type', 'checkbox');
				li.appendChild(input);
				if (handRegist_findItem(handRegCate.data[i].item_id) >= 0) {
					input.setAttribute('checked', 'checked');
				}
				var span = createElement('span', '',
						handRegCate.data[i].description, li);
			}
		}
		div.style.top = top + 'px';
		div.style.left = left + 180 + 'px';
	}

	function handRegist_findItem(id) {
		for (var i = 0; i < (handRegCate.itemIdArray).length; i++) {
			if (parseInt(handRegCate.itemIdArray[i]) == parseInt(id)) {
				return i;
			}
		}
		return -1;
	}

	function handRegisterConfirm() {
		var input = (handRegCate.parent).children[1];
		var _d = handRegisterGetId('handRegistCate_NextDiv_id');
		var ul = _d.children[0];
		var text = input.value;
		for (var i = 0; i < ul.children.length; i++) {
			var item_id = ul.children[i].getAttribute('item_id');
			if (ul.children[i].children[0].checked) {
				if (handRegist_findItem(item_id) == -1) {
					text += ul.children[i].children[1].innerHTML + '、';
					(handRegCate.itemIdArray).push(item_id);
				}
			} else {
				var index = handRegist_findItem(item_id);
				var _t = ul.children[i].children[1].innerHTML + '、';
				if (index >= 0) {
					(handRegCate.itemIdArray).splice(index, 1);
					text = text.replace(_t, '');
				}
			}
		}
		input.value = text;
		handRegisterCancel();
	}

	function handRegisterCancel() {
		var _d = handRegisterGetId('handRegistCate_NextDiv_id');
		if (_d) {
			_d.parentNode.removeChild(_d);
			handRegCate.onSelectFlag = false;
		}
	}

	function handRegisterSelectAllLi() {
		var _d = handRegisterGetId('handRegistCate_NextDiv_id');
		var ul = _d.children[0];
		var c = this.checked;
		for (var i = 0; i < ul.children.length; i++) {
			if (c) {
				ul.children[i].children[0].checked = true;
			} else {
				ul.children[i].children[0].checked = false;
			}
		}
	}

	function handRegisterBodyOutClick(e) {
		var x = jDawn.getEvent(e || window.event).x;
		var y = jDawn.getEvent(e || window.event).y;
		var f_div = handRegisterGetId('handRegistCate_mainDiv_id');
		if (f_div.style.display != 'block'
				|| judgeInsideInput(x, y, handRegCate.parent.children[1])) {
			return;
		}
		var f_div_child = handRegisterGetId('handRegistCate_NextDiv_id');
		var f_left = offsetLeft_toBody(f_div);
		var f_top = offsetTop_toBody(f_div);
		var f_right = f_left + f_div.offsetWidth;
		if (f_div_child)
			f_right = f_left + f_div.offsetWidth + f_div_child.offsetWidth;
		var f_bottom = f_top + f_div.offsetHeight + f_div_child.offsetHeight;
		if (x >= f_left && x <= f_right && y >= f_top && y <= f_bottom) {
			return;
		} else if (x < f_left || y < f_top || handRegCate.secondMenuDiv == null) {
			handRegisterCloseWin();
		} else {
			if (f_div_child != null) {
				var t_d = f_div_child.children[1];
				if (!judgeInsideInput(x, y, t_d)) {
					handRegisterCloseWin();
				} else {
					handRegisterCloseWin();
				}
			}
		}
	}

	function judgeInsideInput(x, y, target) {
		var i_left = offsetLeft_toBody(target);
		var i_top = offsetTop_toBody(target);
		var i_right = i_left + target.offsetWidth;
		var i_bottom = i_top + target.offsetHeight;
		if (x >= i_left && x <= i_right && y < i_top && y < i_bottom) {
			return true;
		}
		return false;
	}

	function handRegisterCloseWin() {
		var div = handRegisterGetId('handRegistCate_mainDiv_id');
		div.style.display = 'none';
		if (handRegCate.secondMenuDiv != null
				&& handRegCate.secondMenuDiv.offsetWidth > 0) {
			if (handRegCate.secondMenuDiv.children.length > 1) {
				var child = handRegCate.secondMenuDiv.children[1];
				child.parentNode.removeChild(child);
			}
			handRegCate.secondMenuDiv.children[0].style.display = 'none';
			handRegCate.secondMenuDiv.style.width = '0px';
			handRegCate.secondMenuDiv.style.borderWidth = '0px';
			handRegCate.onSelectFlag = false;
			handRegCate.onSelectLi.className = '';
			handRegCate.onSelectLi.children[1].style.display = 'none';
		}
	}

})();