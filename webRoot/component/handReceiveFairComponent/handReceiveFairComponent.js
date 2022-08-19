/*
 * 使用说明 使用div标签 名称为'handReceiveFairComponent' 即可
 *   <div name="handReceiveFairComponent" title_text="可收展组件" color="red" comlistvalue="**,**,**">
 *	   <div>
       </div>
 *   </div>
 */
(
	function() {
		var documentAll = document.all;
		var parents = [];
		//根据浏览器的差异选择出name="handReceiveFairComponent"的元素数组
		if (documentAll) {
			//ie下
			var name_index = 0;
			for (var i = 0; i < documentAll.length; i++) {
				if (documentAll[i].name == 'handReceiveFairComponent') {
					addRecFairComp(documentAll[i], name_index);
					name_index++;
				}
			}
			setBodyClickInIE();
		} else {
			//非ie下
			var objList = document.getElementsByName('handReceiveFairComponent');
			for (var i = 0; i < objList.length; i++) {
				addRecFairComp(objList[i], i);
			}
			setBodyClickNotInIe();
		}

		function addRecFairComp(obj, index) {
			var parent = obj;
			parents.push(parent);
			var button_text = obj.getAttribute("title_text");
			var buttton_color = obj.getAttribute("color");
			var c_value = obj.getAttribute("comlistvalue");
			var comlistvalue = (c_value)?obj.getAttribute("comlistvalue").split(','):[];
			var children = parent.children;
			var num = children.length;
			var show_flag = false;
			var show_height;
			var padding;
			var step = [];
			var step_index = 0;
			var list_setInterval;
			var iner_flag = false;
			parent.className = 'handRecFairCp_widget ' + buttton_color;
			children[0].className = 'handRecFairCp_widget_body';
			//初始化收展组件所需的全局变量
			show_height = children[0].offsetHeight;
			step = set_interStep(30);
			//样式布局
			var div = window.document.createElement('div');
			var div_html = '';
			/*var list_ul = '<ul>';
			for (var list_i = 0; list_i < comlistvalue.length; list_i++) {
				list_ul += '<li>' + comlistvalue[list_i] + '</li>';
			}
			list_ul += '</ul>';*/
			div.className = 'handRecFairCp_widget_title';
			div_html += '<div class="title_left"><i class="fa icon-pencil"></i><span style="margin-left:5px;">' + button_text + '</div></span>';
			div_html += '<div class="title_right"><div class="widget-btn-b">报表明细</div></div>';
			div_html += ''
			div.innerHTML = div_html;
			parent.insertBefore(div, children[0]);
			padding = getStyle(children[1],'padding');
			/*children[0].children[1].children[0].onclick = function() {
				if(!iner_flag){
				    list_func(children[1], this);
				} 
			};*/
			/*children[0].children[1].children[1].onclick = function() {
					close_func(parent);
			};*/
			/*children[0].children[1].children[2].onclick = function(){
				list_ul_func(children[0].children[1].children[3]);
			};*/
			function set_interStep(num){
				var e_step = Math.floor(show_height / num);
				var sum = 0;
				for(var i = 0;i < num - 1;i ++){
					step.push(e_step);
					sum += e_step;
				}
				step.push(show_height - sum); 
				return step;
			}
			function list_func(item, _this) {
				iner_flag = true;
				if (show_flag) {
					item.style.padding = padding + 'px';
					list_setInterval = setInterval(function() {
						show_list(item);
					}, 10);
					_this.className = 'fa icon-chevron-up';
				} else {
					list_setInterval = setInterval(function() {
						hide_list(item);
					}, 10);
					_this.className = 'fa icon-chevron-down';
				}
			}

			function hide_list(item) {
				var height = item.offsetHeight;
				if (step_index == step.length || height <= padding*2) {
					clearInterval(list_setInterval);
					iner_flag = false;
					item.style.padding = 0;
					item.style.height = 0;
					show_flag = true;
					step_index = 0;
				} else {
					item.style.height = height - step[step_index] + 'px';
					step_index ++;
				}
			}

			function show_list(item) {
				var height = item.offsetHeight;
				if (height >= show_height) {
					clearInterval(list_setInterval);
					iner_flag = false;
					show_flag = false;
					step_index = 0;
				} else {
					item.style.height = height + step[step_index] - (step_index==0?padding*2:0) + 'px';
					step_index++;
				}
			}

			function close_func(item) {
				item.style.display = 'none';
				var closeFunc = item.getAttribute("closeFunc");
				if (closeFunc != '') {
					eval(closeFunc);
				}
			}

			function list_ul_func(item) {
				var display = item.style.display;
				if (display == 'block') {
					item.style.display = 'none';
				} else {
					item.style.display = 'block';
				}
			}
		}
        //获取样式名称，返回数值型结果
		function getStyle(obj, attr) {
			var value;
			if (obj.currentStyle) {
				value = obj.currentStyle[attr];
			} else {
				value = getComputedStyle(obj, false)[attr];
			}
			value = value.replace("px","");
			return parseInt(value);
		}
		//当点击到其他区域时收展ul选项卡
		function setBodyClickInIE(){
			document.body.attachEvent('onclick',function(e){
				e = window.event || e;
				bodyClick(e);
			});
		}
		function setBodyClickNotInIe(){
			document.body.addEventListener('click',function(e){
				e = window.event || e;
				bodyClick(e);
			},true);
		}
		function bodyClick(e){
			for(var i = 0;i < parents.length;i ++){
				var ul = parents[i].children[0].children[1].children[3];
				var display = ul.style.display;
				if(display == 'block'){
					var _this = parents[i].children[0].children[1].children[2];
					var pos_x = e.clientX;
					var pos_y = e.clientY;
					var p_top = offsetTop_toBody(_this);
					var p_bottom = p_top + _this.offsetHeight;
					var p_left = offsetLeft_toBody(_this);
					var p_right = p_left + _this.offsetWidth;
					if (pos_x > p_right || pos_x < p_left || pos_y < p_top || pos_y > p_bottom) {
						ul.style.display = 'none';
					}
				}
			}
		}
		//利用js的offsetLeft算出目标距离最左边的距离
		function offsetLeft_toBody(_this) {
			var offset_left = _this.offsetLeft;
			while (_this.offsetParent != null) {
				offset_left += (_this.offsetParent.offsetLeft != null) ? _this.offsetParent.offsetLeft : 0;
				_this = _this.offsetParent;
			}
			return offset_left;
		}
		//利用js的offsetTop算出目标距离最上边的距离
	    function offsetTop_toBody(_this) {
		var offset_top = _this.offsetTop;
		while (_this.offsetParent != null) {
			offset_top += (_this.offsetParent.offsetTop != null) ? _this.offsetParent.offsetTop : 0;
			_this = _this.offsetParent;
		}
		return offset_top;
	}
	}
)();