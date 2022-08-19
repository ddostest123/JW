/*
 * 使用说明 使用div标签 名称为'handListButton' 即可
 *   <div name="handListButton" buttontext="下拉菜单栏">
 *	   <ul>
 *		  <li></li>
 *	   </ul>
 *   </div>
 */
(
	function (){
		var objList = window.document.getElementsByName('handListButton');
		var lis_show_flag = false;
		var list_height;
		var list_step;
		var show_setInterval;
		for (var i = 0; i < objList.length; i++){
			addListButton(objList[i]);
		}
		function addListButton(obj){
			var parent = obj;
			var button_text = obj.getAttribute("buttontext");
			var children = parent.children;
			var num = children.length;
			parent.className += 'handlistbutton_body_right';
			children[0].className="handlistbutton_content_rightListTable";
			list_height = children[0].offsetHeight;
			list_step = (list_height-2)/1;
			children[0].style.display = 'none';
			var div = window.document.createElement('div');
			div.className = 'handlistbutton_list_button';
			var div_html = '<div class="left_button"><div>' + button_text + '</div></div>';
			div_html += '<div class="right_button"><div class="caret"></div></div>'
			div.innerHTML = div_html;
			parent.insertBefore(div,children[0]);
			children[0].children[1].onclick = function(){listfuc(children);};
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
		function listfuc(children){
		    var item = children[1];
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
		
	}
)();