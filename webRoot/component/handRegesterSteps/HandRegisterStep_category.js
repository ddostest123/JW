/*
 * 使用说明 使用div标签 名称为'HandRegisterCategory' '
 *   <div name="HandRegisterCategory">
 *  </div>
 */
(function() {

	var handRegCate = {
	    parent:null,
	    data:fnd_registed_category,
	    li_last:null,
	    li_content:null,
	    li_selected:null,
	    item_id:[]
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
		for ( var i = 0; i < objList.length; i++) {
			handRegCate.parent = objList[i];
			addRegisterCategory(objList[i]);
		}
	}
	
	function addRegisterCategory(obj){
		var parent = obj;
		parent.className = 'handCategory';
		// 建立prompt
		var prompt_div = document.createElement('span');
		prompt_div.innerText = '采购品类:';
		parent.appendChild(prompt_div);
		// 建立input
		var input = document.createElement('input');
		parent.appendChild(input);
		// 设置主选择框内容
		addMainDiv();
		// 设计三级选择框
		// addNextDiv(parent);
		// input点击
		input.onclick = function(){
			var div = document.getElementById('handRegistCate_mainDiv_id');
			if(div.style.display == 'block'){
				handRegist_cancel();
				div.style.display = 'none';
			}else{
				div.style.display = 'block';
			}
		}
	}
	
	function addMainDiv(){
		var div = document.createElement('div');
		div.id = 'handRegistCate_mainDiv_id';
		div.className = 'handRegistCategory-main-div';
		handRegCate.parent.appendChild(div);
		// 标题ul
		var html = '<ul>';
		var _html = '';
		var index = 1;
		for(var i = 0;i < handRegCate.data.length;i++){
			if(handRegCate.data[i].parent_id == null){
				html += '<li content_id="reg_main_' + index + '">' + handRegCate.data[i].description + '</li>';
				// 设计二级采购品类
				_html += getSecondCategory(handRegCate.data[i].item_id,'reg_main_'+index);
				index　++;
			}
		}
		html += '</ul>';
		html += '<div class="handRegisted-main-content">' + _html + '</div>';
		div.innerHTML = html;
		div.children[0].children[0].className = 'active';
		div.children[1].children[0].style.display = 'block';
		handRegCate.li_last = div.children[0].children[0];
		handRegCate.li_content = div.children[1].children[0];
		for(var i = 0;i < div.children[0].children.length;i ++){
			div.children[0].children[i].onclick = function(){
				handRegCate.li_last.className = '';
				handRegCate.li_content.style.display = 'none';
				var id = this.getAttribute('content_id');
				var content = document.getElementById(id);
				this.className = 'active';
				content.style.display = 'block';
				handRegCate.li_last = this;
				handRegCate.li_content = content;
		    }
		}
		// 目录点击事件
		for(var i = 0;i < div.children[1].children.length;i ++){
			for(var j = 0;j < div.children[1].children[i].children[0].children.length;j ++){
				var _li = div.children[1].children[i].children[0].children[j];
				_li.setAttribute('index',j);
				_li.onclick = function(){
					var j = this.getAttribute('index');
					if(parseInt(j % 4) == 3 || parseInt(j % 4) == 2){
						handRegisted_cell_click(this,'right');
					}else{
						handRegisted_cell_click(this,'');
					}
				}
			}
		}
	}
	
	function getSecondCategory(id,content_id){
		var html = '';
		html += '<div class="reg-main-content" id="' +　content_id　+　'"><ul>';
		for(var i = 0;i < handRegCate.data.length;i++){
			if(handRegCate.data[i].parent_id == id){
				html += '<li item_id="' + handRegCate.data[i].item_id + '"><i class="icon-plus-sign-alt"></i><span>' + handRegCate.data[i].description + '</span></li>';
			}
		}
		html += '</ul></div>';
		return html;
	}
	
	function addNextDiv(_this){
		var _d = document.getElementById('handRegistCate_NextDiv_id');
		if(_d){
			_d.parentNode.removeChild(_d);
			handRegCate.li_selected.style.border = '3px solid #fff';
			handRegCate.li_selected.style.zIndex = '9';
		}
		var div = document.createElement('div');
		div.id = 'handRegistCate_NextDiv_id';
		div.className = 'handRegistCategory-next-div';
		_this.appendChild(div);
		var html = '<ul></ul>';
		html += '<div class="regitst-bottom"><input id="handRegisted_select_all" type="checkbox">全选</input><button id="handReagisted_btn_confirm" class="btn-confirm">确定</button><button type="button" id="handReagisted_btn_cancel" class="btn-cancel">取消</button></div>';
		div.innerHTML = html;
		document.getElementById('handRegisted_select_all').onclick = handRegist_select_all;
		document.getElementById('handReagisted_btn_confirm').onclick = handRegist_confirm;
		document.getElementById('handReagisted_btn_cancel').onclick = handRegist_cancel;
	}
	
	function handRegisted_cell_click(_this,type){
		addNextDiv(_this.parentNode.parentNode);
		var left = _this.offsetLeft;
		var top = _this.offsetTop;
		var div = document.getElementById('handRegistCate_NextDiv_id');
		div.style.top = top + 47 + 'px';
		if(type == 'right'){
			div.style.right = 0 + 'px';
		}else{
			div.style.left = 0 + 'px';
		}
		div.style.display = 'block';
		_this.style.border = '2px solid #32a4b6';
		_this.style.borderBottom = '2px solid #fff';
		_this.style.zIndex = '12';
		handRegCate.li_selected = _this;
		var item_id = _this.getAttribute('item_id');
		var ul = div.children[0];
		var html = '';
		for(var i = 0;i < handRegCate.data.length;i++){
			if(handRegCate.data[i].parent_id == item_id){
				if(handRegist_findItem(handRegCate.data[i].item_id) >= 0){
					html += '<li item_id="' +　handRegCate.data[i].item_id +'"><input type="checkbox" checked="checked"/><span>' + handRegCate.data[i].description + '</span></li>';
				}else{
				    html += '<li item_id="' +　handRegCate.data[i].item_id +'"><input type="checkbox"/><span>' + handRegCate.data[i].description + '</span></li>';
				}
			}
		}
		ul.innerHTML = html;
		// 当打开的二级采购单过长时向上显示
		var j = _this.getAttribute('index');
		var j_all = _this.parentNode.children.length;
		if(j >= 8){
			var _h = div.offsetHeight;
			div.style.top = top - _h + 3 + 'px';
			_this.style.borderBottom = '2px solid #32a4b6';
			_this.style.borderTop = '2px solid #fff';
		}
	}
	
	function handRegist_findItem(id){
		for(var i = 0;i < (handRegCate.item_id).length;i ++){
			if(parseInt(handRegCate.item_id[i]) == parseInt(id)){
				return i;
			}
		}
		return -1;
	}
	
	function handRegist_confirm(){
		var input = (handRegCate.parent).children[1];
		var _d = document.getElementById('handRegistCate_NextDiv_id');
		var ul = _d.children[0];
		var text = input.value;
		for(var i = 0;i < ul.children.length;i ++){
			var item_id = ul.children[i].getAttribute('item_id');
			if(ul.children[i].children[0].checked ){
				if(handRegist_findItem(item_id) == -1){
					text += ul.children[i].children[1].innerText + '、';
					(handRegCate.item_id).push(item_id);
				}
			}else{
				var index = handRegist_findItem(item_id);
				var _t = ul.children[i].children[1].innerText + '、';
				if(index >= 0){
					(handRegCate.item_id).splice(index,1);
					text = text.replace(_t,'');
				}
			}
		}
		input.value = text;
		handRegist_cancel();
	}
	
	function handRegist_cancel(){
		var _d = document.getElementById('handRegistCate_NextDiv_id');
		if(_d){
			_d.parentNode.removeChild(_d);
			handRegCate.li_selected.style.border = '3px solid #fff';
			handRegCate.li_selected.style.zIndex = '9';
		}
	}
	
	function handRegist_select_all(){
		var _d = document.getElementById('handRegistCate_NextDiv_id');
		var ul = _d.children[0];
		var c = this.checked;
		for(var i = 0;i < ul.children.length;i ++){
			if(c){
				ul.children[i].children[0].checked = true;
		    }else{
		    	ul.children[i].children[0].checked = false;
		    }
		}
	}

})();