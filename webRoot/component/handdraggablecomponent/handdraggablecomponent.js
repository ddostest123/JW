/*
 * 使用说明 使用div标签 名称为'handdraggablecomponent' 即可
 *   <div name="handdraggablecomponent" needControl="true">
 *	   <div name="column">
 *         ...
 *     </div>
 *	   <div name="column">
 *	      ...
 *     </div>
       ...
 *   </div>
 */
(
	function() {
		var documentAll = document.all;
		//判断是否有页面打开(覆盖)
		window.handdragOpenWindowFlag = false;
		//根据浏览器的差异选择出name="handReceiveFairComponent"的元素数组
		if (documentAll) {
			//ie下
			for (var i = 0; i < documentAll.length; i++) {
				if (documentAll[i].name == 'handdraggablecomponent') {
					addDragableComponent(documentAll[i]);
				}
			}
		} else {
			//非ie下
			var objList = window.document.getElementsByName('handdraggablecomponent');
			for (var i = 0; i < objList.length; i++) {
				addDragableComponent(objList[i]);
			}
		}

		function addDragableComponent(obj) {
			//被拖拽的元素
			var dragWidget_this;
			//是否可以继续拖拽的标志
			var dragMove_flag = false;
			//判断拖拽的计时器
			var dragInter;
			//父节点
			var parent
				//父节点下的子节点个数，多少列
			var num;
			var children;
			//被拖拽的元素下方所放置的虚线框
			var mr_holder;
			//记录鼠标的位置，判断鼠标的移动方向
			var mouse_location = [];
			//控制回收站标志
			var control_flag;
			parent = obj;
			children = parent.children;
			num = children.length;
			var column = obj.getAttribute("column");
			var parent_width = parent.offsetWidth;
			//下方增加控制台
			control_flag = obj.getAttribute("needControl");
			var control_width = 0;
			var margin_left = 20 / parent_width;
			var children_width = (1 - (num + 1) * margin_left - control_width) / num;
			parent.className = 'handdragCp_body_class';
			for (var i = 0; i < num; i++) {
				children[i].className = 'handdragCp_column';
				children[i].style.width = children_width * 100 + '%';
				children[i].style.marginLeft = '20px';
				//绑定鼠标按下时事件
				for (var j = 0; j < children[i].children.length; j++) {
					//设置鼠标为可移动样式
					children[i].children[j].style.cursor = 'move';
					children[i].children[j].onmousedown = function(e) {
						//当鼠标点击按到的是目标<i>的组件时，不发生移动
						e = window.event || e;
						var tgr = e.srcElement || e.target;
						var e_which = e.which || e.button;
						if (e_which != 1 || tgr.tagName == 'I' || tgr.tagName == 'LI') {
							return;
						} else {
							var inter_i = 0;
							dragWidget_this = this;
							//判断是长按还是短按（以500ms为界限）
							dragInter = setInterval(function(){
								clearInterInLongPush();
								if(!window.handdragOpenWindowFlag){
								    dragWidget_this.parentNode.style.zIndex = '3';
								    mouseDown(e);
								}
								
							},500);
							dragWidget_this.onmousemove = function(){
								clearInterInLongPush();
							}
							//mouseDown(e);
						}
					};
					children[i].children[j].onmouseup = function(e) {
						e = window.event || e;
						var tgr = e.target || e.srcElement;
						var e_which = e.which || e.button;
						if (e_which != 1 || tgr.tagName == 'I' || tgr.tagName == 'LI' || !dragMove_flag) {
							return;
						} else {
							clearInterInLongPush()
							this.parentNode.style.zIndex = '2';
							mouseUp();
						}
					};
					change_style_inListUl(children[i].children[j].children[0].children[1].children[3],children[i].children[j]);
				}
			}
			children[num - 1].style.marginRight = '20px';
			if (control_flag == 'true') {
				addControlPlace();
				num++;
			}
			
			//判断鼠标按下后是否有新打开的页面在鼠标按下对象的上方（z-index>它）,无返回true,有返回false
			function find_zIndex(){
				var body = document.getElementsByTagName('body')[0];
				var children = body.children;
				var zIndex;
				for(var i = 0;i < children.length;i ++){
					var child = children[i];
					zIndex = (child.tagName == 'div' || child.tagName == 'table')?parseInt(child.style.zIndex):0;
					if(zIndex >= 1){
						return false;
					}
				}
				return true;
			}
			
			//清除setinter判断鼠标是否长按
			function clearInterInLongPush(){
				clearInterval(dragInter);
				dragWidget_this.onmousemove = null;
			}

			//鼠标按下
			function mouseDown(e) {
				var x = e.pageX || e.clientX;
				var y = e.pageY || e.clientY;
				var _this = dragWidget_this;
				var offset_left = _this.offsetLeft;
				var offset_top = _this.offsetTop;
				var width = _this.offsetWidth;
				var height = _this.offsetHeight;
				dragMove_flag = true;
				//在选中的元素下方建立同大小的虚线框
				mouseDown_setDashed_div(width, height, offset_left, offset_top, 'handdragCp_dashed_div');
				_this.onmousemove = function(e) {
					e = window.event || e;
					if (dragMove_flag && mouseOutOf_boder(e)) {
						var eX = e.pageX || e.clientX;
						var eY = e.pageY || e.clientY;
						var l = eX - x; //移动后的相对容器的x距离
						var t = eY - y; //移动后的相对容器的y距离
						dragWidget_this.style.left = l + offset_left + 'px';
						dragWidget_this.style.top = t + offset_top + 'px';
						var ml = offset_left + _this.parentNode.offsetLeft + l + width / 2;
						var mt = offset_top + _this.parentNode.offsetTop + t + height / 2;
						//遍历所有子元素（可移动元素），查看移动的元素是否挤压到其他元素
						for (var i = (control_flag == 'true') ? 1 : 0; i < num; i++) {
							for (var j = 0; j < children[i].children.length; j++) {
								var obj = children[i].children[j];
								if (obj.id != 'mr_holder' && obj.style.position != 'absolute') {
									var left = obj.offsetLeft + obj.parentNode.offsetLeft;
									var right = left + obj.offsetWidth;
									var top = obj.offsetTop + obj.parentNode.offsetTop;
									var bottom = top + obj.offsetHeight;
									//移动元素的中心在其他科移动的元素中心时，挤压容器
									if (ml > left && ml < right && mt > top && mt < bottom) {
										if (mouse_location != '') {
											//判断将要移动的元素在虚线框的方位
											if (!dragWidge_move_loaction(obj, ml, mt)) {
												return;
											}
										}
										//挤压容器,和虚线框互换位置
										change_drag_position(obj);
										//记录
										mouse_location = [ml, mt];
									}
								}
							}
						}
						//移入回收站
						if (control_flag == 'true') {
							var rb_top = offsetTop_toBody(children[0]);
							var rb_bottom = rb_top + children[0].offsetHeight;
							var rb_left = offsetLeft_toBody(children[0]);
							var rb_right = rb_left + children[0].offsetWidth;
							//鼠标移入到回收站内及判断要执行移入回收站的动作
							if (eX > rb_left && eX < rb_right && eY > rb_top && eY < rb_bottom) {
								dragBack_to_mrHolder();
								dragWidget_this.style.display = 'none';
								controlSetCp(dragWidget_this);
							}
						}
					}
				};
			}

			function mouseUp() {
					dragBack_to_mrHolder();
				}
				//在鼠标按下的div下方建立个虚线框

			function mouseDown_setDashed_div(width, height, offset_left, offset_top, dashed_class) {
					//设置虚线框样式
					var div = document.createElement("div");
					div.id = "mr_holder";
					div.className = dashed_class;
					//div.style.height = height + 'px';
					//div.style.width = width + 'px';
					div.style.marginBottom = '20px';
					dragWidget_this.parentNode.insertBefore(div, dragWidget_this);
					div = set_offsetWidth(width, div);
					div = set_offsetHeight(height, div);
					mr_holder = window.document.getElementById('mr_holder');
					//在全局定位数据里，将虚线框id代替要移动的元素
					//修改鼠标按下的元素的样式，以及位置
					dragWidget_this.style.position = 'absolute';
					dragWidget_this.style.zIndex = '99';
					dragWidget_this.style.opacity = '0.75';
					dragWidget_this.style.boxShadow = '5px 5px 10px #888888';
					//dragWidget_this.style.width = width + 'px';
					//dragWidget_this.style.height = height + 'px';
					dragWidget_this = set_offsetWidth(width, dragWidget_this);
					dragWidget_this = set_offsetHeight(height, dragWidget_this);
					dragWidget_this.style.left = offset_left + 'px';
					dragWidget_this.style.top = offset_top + 'px';
				}
				//判断鼠标移动时是否超出边界

			function mouseOutOf_boder(e) {
					var x = e.pageX || e.clientX;
					var y = e.pageY || e.clientY;
					var left = offsetLeft_toBody(parent);
					var right = left + parent.offsetWidth;
					var top = offsetTop_toBody(parent);
					var bottom = top + parent.offsetHeight;
					if (x >= right - 10 || x <= left + 10 || y >= bottom - 10 || y <= top + 10) {
						//移动的元素返回虚线框
						dragBack_to_mrHolder();
						return false;
					} else {
						return true;
					}
				}
				//判断元素的高度是否包含border的宽度（兼容ie7）

			function set_offsetHeight(height, _this) {
					_this.style.height = height + 'px';
					var l_height = _this.offsetHeight;
					var differ = (l_height > height) ? l_height - height : 0;
					_this.style.height = (height - differ) + 'px';
					return _this;
				}
				//判断元素的宽度是否包含border的宽度（兼容ie7）

			function set_offsetWidth(width, _this) {
					_this.style.width = width + 'px';
					var l_width = _this.offsetWidth;
					var differ = (l_width > width) ? l_width - width : 0;
					_this.style.width = (width - differ) + 'px';
					return _this;
				}
				//利用js的offsetWidth算出目标距离最左边的距离

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
				/*拖拽元素挤压其他元素时的预处理：被挤压的容器相对虚线框的向量和鼠标移动的方向在同
				一方向内时才可以满足挤压容器的条件*/

			function dragWidge_move_loaction(obj, ml, mt) {
					var x_m = ml - mouse_location[0];
					var y_m = mt - mouse_location[1];
					var x_dis = obj.offsetLeft - mr_holder.offsetLeft;
					var y_dis = obj.offsetTop - mr_holder.offsetTop;
					if (x_m * x_dis >= 0 && y_dis * y_m >= 0 && (x_m != 0 || y_m != 0)) {
						return true;
					} else {
						return false;
					}
				}
				/*当前元素被挤压，与虚线框交换位置：
				 * 交换准则：（1）取被挤压元素的后一个元素，如果它是父节点上的最后一个元素，则取它的前一个元素
				 *       （2）将被挤压的元素插入到虚线框的前面
				 *       （3）如果被挤压的元素不是父节点上的最后一个元素
				 *           1.如果它后面的元素是虚线框，把虚线框插入到被被挤压元素前
				 *           2.如果它后面的元素不是虚线框，把虚线框插入到它后面的元素前（不存在这种情况）
				 *          如果被挤压的元素是父节点上的最后一个元素
				 *           1.如果它前面的元素是虚线框，把虚线框插入到被被挤压元素后（不需要这步操作）
				 *           2.如果它前面的元素不是虚线框，把虚线框插入到它后面的元素后（不存在这种情况）
				 */

			function change_drag_position(obj) {
					var width = obj.offsetWidth;
					var flag = true;
					var length = obj.parentNode.children.length;
					//取被移动元素的后一个元素，如果被移动元素时最后一个，取它的前一个元素
					var next_pre = obj.nextSibling;
					if (obj == obj.parentNode.children[length - 1]) {
						next_pre = obj.previousSibling;
						flag = false;
					}
					//交换时禁止移动
					dragMove_flag = false;
					//被交换的元素样式置为绝对样式
					obj.style.position = 'absolute';
					obj.style.width = width;
					//将被交换元素插入到虚线框后面,再还原它的样式
					mr_holder.parentNode.insertBefore(obj, mr_holder);
					obj.style.cssText = 'cursor:move';
					//最后将虚线框移动到被挤压元素的位置上
					if (flag) {
						//如果后一个元素是虚线框，那么不需要移动虚线框了.否则将虚线框移动next_pre的前面
						if (next_pre.id != 'mr_holder') {
							next_pre.parentNode.insertBefore(mr_holder, next_pre);
						} else {
							next_pre.parentNode.insertBefore(mr_holder, obj);
						}
					} else {
						//如果前一个元素是虚线框，那么不需要移动虚线框了.否则将虚线框移动next_pre的后面
						if (next_pre.id != 'mr_holder') {
							next_pre.parentNode.insertBefore(mr_holder, next_pre.nextSibling);
						} else {
							next_pre.parentNode.insertBefore(mr_holder, obj.nextSibling);
						}
					}
					//恢复移动
					dragMove_flag = true;
				}
				//拖拽的元素返回到虚线框

			function dragBack_to_mrHolder() {
					//var height = dragWidget_this.offsetHeight;
					dragMove_flag = false;
					mouse_location = [];
					dragWidget_this.style.cssText = 'cursor:move';
					//dragWidget_this.style.height = height + 'px';
					mr_holder.parentNode.insertBefore(dragWidget_this, mr_holder);
					mr_holder.parentNode.removeChild(mr_holder);
				}
				//建立回收站组件

			function addControlPlace() {
					var div = document.createElement("div");
					var height = parent.offsetHeight;
					div.className = 'handdragCp_controlplace';
					/* div.style.height = height - 40 - 20 - 4 + 'px'; */
					/* div.innerHTML = '<div class="title"><div class="left">回收站</div><div class="right"><i class="fa fa-trash-o" ></i></div></div>'; */
					div.innerHTML = '<div style="float:left;width:50px;height:100%;background-color:#404040"><i class="fa icon-trash" style="font-size:30px;color:#fff;padding:10px 12px;"></i></div>';
					parent.insertBefore(div, children[0]);
					//元素被关闭时移动到回收站中
					window.closeFun = function(event) {
						//获取关闭的元素
						event = window.event || event;
						var srcEle = event.target || event.srcElement;
						var _this = srcEle.parentNode.parentNode.parentNode;
						controlSetCp(_this);
					}
				}
				//在回收站建立图标

			function controlSetCp(_this) {
					var _this_color = _this.getAttribute("color");
					var _this_title = _this.getAttribute("title_text");
					var div = document.createElement("div");
					div.className = 'handdragCp_controlCp ' + _this_color;
					div.innerHTML = '<div style="float:left;width:60%;margin-top:7px">' + _this_title + '</div><div style="float:right;width:40%;margin-top:5px"><i class="fa icon-share-alt" style="font-size:18px;margin:6px 4px;cursor:pointer"></i></div>';
					children[0].appendChild(div);
					div.children[1].children[0].onclick = function() {
						controlMoveBack(_this, div);
					};
					div.children[0].onmousedown = function(e) {
						e = window.event || e;
						rbOnmouseDown(e, div, _this);
					}
					div.children[0].onmouseup = function(e) {
						if (dragMove_flag) {
							dragBack_to_mrHolder();
						}
					}
				}
				//回收站图标返回主页面，加载到第一列第一个

			function controlMoveBack(_this, div) {
					//div.style.display = 'none';
					div.outerHTML = '';
					_this.style.display = 'block';
				}
				//回收站的图标移动

			function rbOnmouseDown(e, _this, drag_this) {
				var x = e.pageX || e.clientX;
				var y = e.pageY || e.clientY;
				var width = _this.offsetWidth;
				var height = _this.offsetHeight;
				var offset_left = _this.offsetLeft;
				var offset_top = _this.offsetTop;
				var offsetLeft = offsetLeft_toBody(_this);
				var offsetTop = offsetTop_toBody(_this);
				dragWidget_this = _this;
				dragMove_flag = true;
				//在选中的元素下方建立同大小的虚线框
				mouseDown_setDashed_div(width, height, offset_left, offset_top, 'handdragCp_rubbish_dashed_div');
				/* mr_holder.style.margin = '5px auto'; */
				dragWidget_this.style.top = dragWidget_this.offsetTop - 8 + 'px';
				dragWidget_this.style.left = dragWidget_this.offsetLeft - 8 + 'px';
				_this.onmousemove = function(e) {
					e = window.event || e;
					if (dragMove_flag) {
						var l = (e.pageX || e.clientX) - x; //移动后的相对容器的x距离
						var t = (e.pageY || e.clientY) - y; //移动后的相对容器的y距离
						dragWidget_this.style.left = l + offset_left + 'px';
						dragWidget_this.style.top = t + offset_top + 'px';
						var ml = offsetLeft + l + width / 2;
						var mt = offsetTop + t + height / 2;
						var rb_top = offsetTop_toBody(children[0]);
						var rb_bottom = rb_top + children[0].offsetHeight;
						var rb_left = offsetLeft_toBody(children[0]);
						var rb_right = rb_left + children[0].offsetWidth;
						if (ml < rb_left || ml > rb_right || mt < rb_top || mt > rb_bottom) {
							controlMoveBack(drag_this, dragWidget_this);
							//mr_holder.style.display = 'none';
							mr_holder.outerHTML = '';
							dragMove_flag = false;
						}
					}
				}
			}
			/*
			 * 下拉框的颜色切换功能，可改变handreceiveFairComponent的颜色
			 * 根据颜色改变对应的可移动框的颜色风格
			*/
			function change_style_inListUl(_ul,parent){
				_ul.onclick = function(e){
					e = window.event || e;
					var tgr = e.srcElement || e.target;
					if(tgr.tagName == 'LI'){
						var color = tgr.innerText;
						color = getColorValue(color);
						parent.className = 'handRecFairCp_widget '+color;
					}
                };
			}
			function getColorValue(color){
				var color_code;
				switch(color){
				case '红色':
					color_code = 'red';
					break;
				case '黄色':
					color_code = 'yellow';
					break;
				case '绿色':
					color_code = 'green';
					break;
				case '紫色':
					color_code = 'purple';
					break;
				case '蓝色':
				    color_code = 'blue';
				    break;
				case '黑色':
					color_code = 'black';
					break;
				case '浅蓝':
					color_code = 'light_blue';
					break;
				case '白色':
					color_code = 'white';
					break;
				default:
					color_code = 'white';
				    break;
				}
				return color_code;
			}
		}
	}
)();