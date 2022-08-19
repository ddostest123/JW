/*
 * 使用说明 使用div标签 名称为'handListButton' 即可 buttonType值有'combobox','normal'
 *   <div name="handListButton" buttontext="下拉菜单栏" buttonType="combobox">
 *	   <ul>
 *	     <li click="func1()">输入文字</li>
 *       <li click="func2()">输入文字</li>
 *	   </ul>
 *  </div>
 */
(
	function (){
		var objList = window.document.getElementsByName('handListButton');
		//var children;
		//var lis_show_flag = false;
		//var list_height;
		//var list_step;
		//var show_setInterval;
		//var button_type;
		for (var i = 0; i < objList.length; i++){
			addListButton(objList[i]);
		}
		function addListButton(obj){
			var parent = obj;
			var button_text = obj.getAttribute("buttontext");
			var color = obj.getAttribute("color");
			var children = parent.children;
			var num = children.length;
			var list_item = children[0];
			var list_length;
			var lis_show_flag = false;
			var show_setInterval;
			parent.className += 'handlistButton_body_right '+color;
			list_item.className="handlistButton_content_rightListTable";
			var list_height = list_item.offsetHeight;
			var list_length = list_item.offsetWidth;
			var list_step = (list_height-2)/1;
			list_item.style.display = 'none';
			var div = window.document.createElement('div');
			div.className = 'handlistButton_list_button';
			var div_html = '<div class="left_button"><div>' + button_text + '</div></div>';
			div_html += '<div class="right_button"><div class="caret"></div></div>'
			div.innerHTML = div_html;
			parent.insertBefore(div,children[0]);
			children[0].children[1].onclick = function(){listfuc(children[1]);};
			//绑定下拉菜单栏的按钮事件
			var button_type = obj.getAttribute("buttonType");
			if(button_type == 'combobox'){
			    children[0].children[0].style.width = list_length + 'px';
				children[0].children[0].style.cursor = 'pointer';
				children[1].style.width = list_length + 25 + 'px';
			}
			children[0].style.width = children[0].children[0].offsetWidth + children[0].children[1].offsetWidth +'px';
			parent.style.width = children[0].children[0].offsetWidth + children[0].children[1].offsetWidth +'px';
			for(var i = 0;i < children[1].children.length;i++){
				children[1].children[i].onclick = function(){listLiclick(this,children,button_type);};
			}
		
		function show_list(_this){
		    var height = _this.offsetHeight;
			if(height >= list_height){
			   clearInterval(show_setInterval);
			   lis_show_flag = true;
			}else{
			    _this.style.height = height + list_step-2 +'px';
			}
		}
		function hide_list(_this){
		    var height = _this.offsetHeight;
			if(height <= 2){
			   clearInterval(show_setInterval);
			   lis_show_flag = false;
			   _this.style.display = 'none';
			}else{
			   _this.style.height = height - list_step-2 +'px';
			}
		}
		function listfuc(item){
		    if(lis_show_flag){
			   //显示下拉菜单栏
			   show_setInterval = setInterval(function() {
                     hide_list(item);
                }, 50);
			} else{
			    item.style.display = 'block';
			    item.style.height = 0 +'px';
			    //隐藏下拉菜单栏
			    show_setInterval = setInterval(function() {
                     show_list(item);
                }, 50);
			}
		}
		function listLiclick(_this,children,button_type){
		    var text = _this.innerText;
			var length = _this.offsetWidth;
			var click_func = _this.getAttribute("click");
			if(button_type == 'combobox'){
			    children[0].children[0].children[0].innerText = text;
				children[0].children[0].onclick = function(){eval(click_func);};
			}else{
				eval(click_func);
			}
		}
		}
	}
)();