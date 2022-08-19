/*
 * 使用说明 使用div标签 名称为'handReceiveFairComponent' 即可
 *   <div name="handListButton" title_text="可收展组件">
 *	   <div>
       </div>
 *   </div>
 */
(
	function (){
		var objList = window.document.getElementsByName('handReceiveFairComponent');
		var show_flag = false;
		var show_height;
		var total_heigth;
		var step;
		var list_setInterval;
		for (var i = 0; i < objList.length; i++){
			addRecFairComp(objList[i]);
		}
		function addRecFairComp(obj){
		    var parent = obj;
			var button_text = obj.getAttribute("title_text");
			var children = parent.children;
			var num = children.length;
			parent.className = 'handRecFairCp_widget handRecFairCp_red';
			children[0].className = 'handRecFairCp_widget_body';
			show_height = children[0].offsetHeight;
			step = (show_height)/1;
			var div = window.document.createElement('div');
			var div_html = '';
			div.className = 'handRecFairCp_widget_title';
			div_html += '<div class="title_left"><i class="fa fa-pencil-square-o"></i><div>' + button_text + '</div></div>';
			div_html += '<div class="title_right"><i class="fa fa-chevron-up"></i><i class="fa fa-times"></i></div>';
			div.innerHTML = div_html;
			parent.insertBefore(div,children[0]);
			children[0].children[1].children[0].onclick = function(){list_func(children[1],this);}
			children[0].children[1].children[1].onclick = function(){close_func(parent);}
		}
		function list_func(item,_this){
		    if(show_flag){
			    item.style.padding = '5px';
			    list_setInterval = setInterval(function() {
                     show_list(item);
                }, 50);
				_this.className = 'fa fa-chevron-up';
			}else{
			    list_setInterval = setInterval(function() {
                     hide_list(item);
                }, 50);
				_this.className = 'fa fa-chevron-down';
			}
		}
		function hide_list(item){
		    var height = item.offsetHeight;
			if(height <= 10){
			   clearInterval(list_setInterval);
			   item.parentNode.style.height = item.parentNode.children[0].offsetHeight + 'px';
			   item.style.padding = '0px';
			   show_flag = true;
			}else{
			   item.style.height = height - step +'px';
			}
		}
		function show_list(item){
		    var height = item.offsetHeight;
			if(height >= show_height){
			   clearInterval(list_setInterval);
			   show_flag = false;
			}else{
			   item.style.height = height + step - 20 +'px';
			   item.parentNode.style.height = item.parentNode.children[0].offsetHeight + step + 'px';
			}
		}
		
		function close_func(item){
		    item.style.display = 'none';
		}
	}
)();