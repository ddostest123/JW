/*
 * 使用说明 使用div标签 名称为'handLocationPicker' '
 *   <div name="handLocationPicker">
 *  </div>
 */
(function() {

	var handLocaPick = {
		locapicker : null,
		input : null,
		location : registerd_location,
		width : 200,
		onshowli : null,
		onshowcon : null,
		province : null,
		city : null,
		cityList : null,
		city_direc : null,
		onoverli : null,
		proTimeout : null,
		province_id : null,
		city_id : null,
		loadfun : null,
		load : null,
		city_select : null
	};
	var documentAll = document.all;
	// 判断浏览器差异
	if (documentAll) {
		// ie下
		for ( var i = 0; i < documentAll.length; i++) {
			if (documentAll[i] &&　documentAll[i].getAttribute　&& documentAll[i].getAttribute('name')) {
				if (documentAll[i].getAttribute('name') == 'handLocationPicker') {
					var objList = [];
					objList.push(documentAll[i]);
					handLocaPick.locapicker = documentAll[i];
					addLocationPicker(documentAll[i]);
				}
			}
		}
	} else {
		// 非ie下
		var objList = window.document.getElementsByName('handLocationPicker');
		for ( var i = 0; i < objList.length; i++) {
			handLocaPick.locapicker = objList[i];
			addLocationPicker(objList[i]);
		}
	}

	function addLocationPicker(obj) {
		var width = obj.getAttribute("width") || handLocaPick.width;
		var require_flag = obj.getAttribute("require");
		handLocaPick.loadfun = obj.getAttribute("loadfunc");
		handLocaPick.load = obj.getAttribute("load");
		obj.className = 'handLocationPicker';
		/* 输入框 */
		var input_div = document.createElement('input');
		input_div.className = 'input';
		if (require_flag) {
			input_div.style.border = '1px solid #e76e70';
		}
		input_div.style.width = width + 'px';
		input_div.setAttribute('readonly','true');
		input_div.onclick = function() {
			input_onclick(this.nextSibling);
		};
		/*document.body.onclick = function(e) {
			e = e || window.event;
			body_out_input_onclick(e);
		};*/
		var target = document.body;
		if(target.addEventListener){  
	        // 监听IE9，谷歌和火狐
			target.addEventListener('click', function(e){
				e = e || window.event;
				body_out_input_onclick(e);
			}, true);
	    }else if(target.attachEvent){  
	        target.attachEvent('onclick', function(e){
	        	e = e || window.event;
				body_out_input_onclick(e);
			});  
	    }else{  
	        target["onclick"] = function(e){
	        	e = e || window.event;
				body_out_input_onclick(e);
			};  
	    }
		obj.appendChild(input_div);
		handLocaPick.input = input_div;
		/* 设置省份城市的关联页面 */
		var div = document.createElement('div');
		div.className = 'show-window';
		var html = addShowDiv();
		div.innerHTML = html;
		obj.appendChild(div);
		handLocaPick.province = div;
		// 设置li的js事件
		set_mouseOver_function();
		/* 增加城市的关联页面 */
		var div = document.createElement('div');
		div.className = 'show-city-window';
		div.id = "handLocation_city_id"
		var html = addShowCityDiv();
		html += '<div id="hand_city_direction" class="rec-direction"></div>';
		div.innerHTML = html;
		obj.appendChild(div);
		handLocaPick.city = div;
		handLocaPick.cityList = document.getElementById('hand_city_id');
		handLocaPick.city_direc = document
				.getElementById('hand_city_direction');
		// tab切换事件
		search_tab_switch();
		// 加载结束
		eval(handLocaPick.load);
	}

	function addShowDiv() {
		var html = '';
		var _html;
		html += '<div class="search-div"></div>';
		html += '<div class="title"><ul id="serch_title"><li class="on">主要省份</li><li>A-H</li><li>I-Q</li><li>R-Z</li></ul></div>';
		html += '<div id="main_content" class="main-content">';
		// 第一页面
		html += '<div id="handLoca_con1" class="content" >';
		html += '<ul class="hot-loca"><li province_id="11">北京</li><li province_id="31">上海</li><li province_id="43">湖南</li><li province_id="42">湖北</li><li province_id="44">广东</li><li province_id="33">浙江</li><li province_id="35">福建</li><li province_id="50">重庆</li><li province_id="23">黑龙江</li><li province_id="32">江苏</li><li province_id="36">江西</li><li province_id="21">辽宁</li><li province_id="63">青海</li><li province_id="51">四川</li></ul>';
		html += '</div>';
		// 第二页面
		html += '<div id="handLoca_con2" class="content">';
		_html = get_locationByFisrtL('province', 'A');
		html += _html;
		_html = get_locationByFisrtL('province', 'B');
		html += _html;
		_html = get_locationByFisrtL('province', 'C');
		html += _html;
		_html = get_locationByFisrtL('province', 'D');
		html += _html;
		_html = get_locationByFisrtL('province', 'E');
		html += _html;
		_html = get_locationByFisrtL('province', 'F');
		html += _html;
		_html = get_locationByFisrtL('province', 'G');
		html += _html;
		_html = get_locationByFisrtL('province', 'H');
		html += _html;
		html += '</div>';
		// 地四个页面
		html += '<div id="handLoca_con3" class="content">';
		_html = get_locationByFisrtL('province', 'I');
		html += _html;
		_html = get_locationByFisrtL('province', 'J');
		html += _html;
		_html = get_locationByFisrtL('province', 'K');
		html += _html;
		_html = get_locationByFisrtL('province', 'L');
		html += _html;
		_html = get_locationByFisrtL('province', 'M');
		html += _html;
		_html = get_locationByFisrtL('province', 'N');
		html += _html;
		_html = get_locationByFisrtL('province', 'O');
		html += _html;
		_html = get_locationByFisrtL('province', 'P');
		html += _html;
		_html = get_locationByFisrtL('province', 'Q');
		html += _html;
		html += '</div>';
		// 地六个页面
		html += '<div id="handLoca_con3" class="content">';
		_html = get_locationByFisrtL('province', 'R');
		html += _html;
		_html = get_locationByFisrtL('province', 'S');
		html += _html;
		_html = get_locationByFisrtL('province', 'T');
		html += _html;
		_html = get_locationByFisrtL('province', 'U');
		html += _html;
		_html = get_locationByFisrtL('province', 'V');
		html += _html;
		_html = get_locationByFisrtL('province', 'W');
		html += _html;
		_html = get_locationByFisrtL('province', 'X');
		html += _html;
		_html = get_locationByFisrtL('province', 'Y');
		html += _html;
		_html = get_locationByFisrtL('province', 'Z');
		html += _html;
		html += '</div>';
		// 结束
		html += '</div>';
		return html;
	}
	// 根据地址首字母获取内容
	function get_locationByFisrtL(type, letter) {
		var html = '';
		var _html = '';
		for ( var i = 0; i < handLocaPick.location.length; i++) {
			if (handLocaPick.location[i].fisrtl == letter) {
				_html += '<li province_id="' + handLocaPick.location[i].id
						+ '">' + handLocaPick.location[i].province + '</li>';
			}
		}
		if (_html == '') {
			return html;
		}
		html += '<div class="row">';
		html += '<div class="h-left yellow fisrtletter">' + letter + '</div>';
		html += '<div class="h-left loca"><ul class="hot-loca">' + _html
				+ '</ul></div>';
		html += '</div>';
		return html;
	}
	// 设置省份li的鼠标事件
	function set_mouseOver_function() {
		var main = document.getElementById('main_content');
		var ul = main.getElementsByTagName('ul');
		for ( var index = 0; index < ul.length; index++) {
			if (ul[index].className == 'hot-loca') {
				set_ulLi_function(ul[index]);
			}
		}
	}
	// 绑定ul下的li的事件
	function set_ulLi_function(ul) {
		for ( var i = 0; i < ul.children.length; i++) {
			ul.children[i].onmouseover = function() {
				handLocaPick.onoverli = this;
				this.style.color = '#fff';
				this.style.backgroundColor = '#5fb4ce';
				handLocaPick.proTimeout = setTimeout(function() {
					province_to_city();
				}, 500);
			};
			ul.children[i].onmouseout = function(e) {
				handLocaPick.onoverli = null;
				this.style.color = '#484b50';
				this.style.backgroundColor = '#fff';
				clearTimeout(handLocaPick.proTimeout);
				province_to_city_none(e);
			};
		}
	}
	// 省份-城市关联div显示设置
	function province_to_city() {
		var html = '';
		var province = handLocaPick.onoverli.innerHTML;
		var province_id = handLocaPick.onoverli.getAttribute('province_id');
		var left = handLocaPick.onoverli.offsetLeft
				+ handLocaPick.onoverli.offsetWidth;
		var top = handLocaPick.onoverli.offsetTop
				+ handLocaPick.onoverli.offsetHeight / 2;
		for ( var i = 0; i < handLocaPick.location.length; i++) {
			if (handLocaPick.location[i].province == province) {
				for ( var j = 0; j < handLocaPick.location[i].city.length; j++) {
					var city_name = handLocaPick.location[i].city[j].name;
					var city_id = handLocaPick.location[i].city[j].id;
					html += '<li content_province="' + province
							+ '" province_id="' + province_id
							+ '" content_city="' + city_name + '" city_id="'
							+ city_id + '">' + str_sub(city_name, 4) + '</li>';
				}
			}
		}
		handLocaPick.cityList.innerHTML = html;
		for ( var i = 0; i < handLocaPick.cityList.children.length; i++) {
			handLocaPick.cityList.children[i].onclick = function() {
				city_select_function(this);
			}
		}
		handLocaPick.city.style.display = 'block';
		var height = handLocaPick.city.offsetHeight;
		handLocaPick.city.style.left = left + 10 + 'px';
		handLocaPick.city.style.top = 43 + 30 + top - height / 2 + 'px';
		handLocaPick.city_direc.style.top = (height - 8 - 10) / 2 + 'px';
		handLocaPick.city.onmouseover = function() {
			this.style.display = 'block';
		};
		handLocaPick.city.onmouseout = function() {
			this.style.display = 'none';
		};
	}
	// 省份-城市关联div隐藏
	function province_to_city_none(e) {
		e = window.event || e;
		var pos_x = e.pageX;
		var pos_y = e.pageY;
		var _this = handLocaPick.city;
		var p_top = offsetTop_toBody(_this);
		var p_bottom = p_top + _this.offsetHeight;
		var p_left = offsetLeft_toBody(_this);
		var p_right = p_left + _this.offsetWidth;
		if (pos_x > p_right || pos_x < p_left || pos_y < p_top
				|| pos_y > p_bottom) {
			handLocaPick.city.style.display = 'none';
		}
	}
	// 城市点击选中
	function city_select_function(_this) {
		var province = _this.getAttribute('content_province');
		var province_id = _this.getAttribute('province_id');
		var city = _this.getAttribute('content_city');
		var city_id = _this.getAttribute('city_id');
		var name = province + ' ' + city;
		handLocaPick.input.value = name;
		handLocaPick.locapicker.setAttribute('parent', province);
		handLocaPick.locapicker.setAttribute('child', city);
		handLocaPick.locapicker.setAttribute('parent_id', province_id);
		handLocaPick.locapicker.setAttribute('children_id', city_id);
		handLocaPick.province.style.display = 'none';
		handLocaPick.city.style.display = 'none';
		eval(handLocaPick.loadfun);
	}
	// 城市的html页面
	function addShowCityDiv() {
		var html = '';
		html += '<ul id="hand_city_id" class="hot-loca"></ul>';
		return html;
	}
	// 字符串截取
	function str_sub(str, num) {
		if (num >= str.length) {
			return str;
		} else {
			str = str.substr(0, num) + '...';
			return str;
		}
	}
	// tab选项切换
	function search_tab_switch() {
		var li = document.getElementById('serch_title').children;
		handLocaPick.onshowli = li[0];
		handLocaPick.onshowcon = document.getElementById('main_content').children[0]
		for ( var i = 0; i < li.length; i++) {
			li[i].index = i;
			li[i].onclick = function() {
				// 找出此li位置index
				var index = this.index;
				var con = document.getElementById('main_content').children[index];
				handLocaPick.onshowli.className = '';
				handLocaPick.onshowcon.style.display = 'none';
				this.className = 'on';
				con.style.display = 'block';
				handLocaPick.onshowli = this;
				handLocaPick.onshowcon = con;
			}
		}
	}
	// 点击编辑框显示地址信息搜框
	function input_onclick(obj) {
		var flag = obj.parentNode.getAttribute('use_flag');
		if (flag == 'true') {
			obj.style.display = 'block';
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
	// 点击其他地方将地址框隐藏
	function body_out_input_onclick(e) {
		for ( var i = 0; i < objList.length; i++) {
			var _this = objList[i].children[1];
			if (get_click_range(e, _this)) {
				_this = objList[i].children[0];
				if (get_click_range(e, _this)) {
					objList[i].children[1].style.display = 'none';
				}
			}
		}
	}

	function get_click_range(e, _this) {
		var pos_x = e.pageX;
		var pos_y = e.pageY;
		var p_top = offsetTop_toBody(_this);
		var p_bottom = p_top + _this.offsetHeight;
		var p_left = offsetLeft_toBody(_this);
		var p_right = p_left + _this.offsetWidth;
		if (pos_x > p_right || pos_x < p_left || pos_y < p_top
				|| pos_y > p_bottom) {
			return true;
		}
	}
})();