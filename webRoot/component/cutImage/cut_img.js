/*
 * 切割图片的js
 * con 切割图片的容器
 * src 图片源
 */
function CutTool(con, src) {
	var _this = this;
	var _cutImgComponentCon = (typeof con == "string") ? document.getElementById(con) : con;
	
	var _cutImgCon;
	var _toolRects = new Array();
	var _img = null;
	var _cutToolDom = null;
	var _dragToolDom = null;
	var _form;
	var _mouse = {
		x0: 0,
		y0: 0,
		xt: 0,
		yt: 0,
		dx: 0,
		dy: 0,
		type: "move"
	};
	var _lineRects = {
		lineVertical: undefined,
		lineAcross: undefined
	};
	var _mask = {
		top: undefined,
		bottom: undefined,
		left: undefined,
		right: undefined
	};

	//图片尺寸
	var _size = {
		width: 0,
		height: 0,
		originalWidth: 0,
		originalHeight: 0,
		viewScale:1,
		viewHeight:0,
		viewWidth:0,
		maxWidth:0,
		maxHeight:0
	}
	
	//工具的坐标
	var _tool = {
		x: 0,
		y: 0,
		width: 0,
		height: 0,
		scale: 1,
		minHeight: 40,
		minWidth: 40
	}
	
	_this.cutInfor = function() {
		return _tool;
	}

	_this.initCutTool = function(mw, mh) {
		var i = 0,tempDom, tempDiv, tempTool, s;
		
		var view =  jDawn.getPageSize();
		_size.maxWidth = parseInt(mw || view.pageWidth * 0.9);
		_size.maxHeight = parseInt(mh || view.pageHeight * 0.9),
		_cutImgComponentCon.style.width = _size.maxWidth + "px";
		
		
		
		//加载form
		_form = renderElement("FORM", "cut-img-form");
		_form.name = "";
		_form.appendChild(renderFormPara("x:", "x"));
		_form.appendChild(renderFormPara("y:", "y"));
		_form.appendChild(renderFormPara("w:", "width"));
		_form.appendChild(renderFormPara("h:", "height"));
		_form.appendChild(renderFormPara("s:", "scale"));
		
		var div = renderElement("DIV", "button", "裁剪");
		div.onclick = _this.doCutAction 
		_form.appendChild(renderElement("DIV", "cut-img-infor", '')).appendChild(div);
		_cutImgComponentCon.appendChild(_form);
		
		_cutImgCon = renderElement("DIV", 'cut-img-con');
		_cutImgComponentCon.appendChild(_cutImgCon);
		_cutImgCon.onselectstart = onselect;
		//渲染工具
		_cutToolDom = renderElement("DIV", "cut-img-tool");
		_cutImgCon.appendChild(_cutToolDom);

		_dragToolDom = renderElement("DIV", "tool-rect-drag");
		_cutToolDom.appendChild(_dragToolDom);
		_dragToolDom.type = "move";
		jDawn.bindEvent(_dragToolDom, 'mousedown', onMouseDown);

		//工具矩形 
		tempDiv = renderElement("DIV", "tool-circle");
		_cutToolDom.appendChild(tempDiv);
		for (i = 0; i < 9; i++) {
			tempTool = renderElement("DIV", "tool-rect");
			tempTool.onselectstart = onselect;
			_toolRects.push(tempTool);
			if (i == 0 || i == 8) {
				tempTool.style.cursor = "se-resize";
				if (i == 0) {
					tempTool.type = "resize-right-down-t";
				} else {
					tempTool.type = "resize-right-down-b";
				}
			} else if (i == 1 || i == 7) {
				tempTool.style.cursor = "s-resize";
				if (i == 1) {
					tempTool.type = "resize-vertical-t";
				} else {
					tempTool.type = "resize-vertical-b";
				}
			} else if (i == 2 || i == 6) {
				tempTool.style.cursor = "sw-resize";
				if (i == 2) {
					tempTool.type = "resize-left-down-t";
				} else {
					tempTool.type = "resize-left-down-b";
				}
			} else if (i == 3 || i == 5) {
				tempTool.style.cursor = "ew-resize";
				if (i == 3) {
					tempTool.type = "resize-across-l";
				} else {
					tempTool.type = "resize-across-r";
				}
			} else {
				continue;
			}
			tempDiv.appendChild(tempTool);
			jDawn.bindEvent(tempTool, 'mousedown', onMouseDown);
		}

		//工具线
		tempDiv = renderElement("DIV", "line-con");
		_cutToolDom.appendChild(tempDiv);

		tempTool = renderElement("DIV", "line-vertical");
		tempDiv.appendChild(tempTool);
		_lineRects.lineVertical = tempTool;

		tempTool = renderElement("DIV", "line-across");
		tempDiv.appendChild(tempTool);
		_lineRects.lineAcross = tempTool;

		//遮罩层
		tempDom = renderElement("DIV", "img-mask-con");
		_cutImgCon.appendChild(tempDom);

		tempTool = renderElement("DIV", "mask");
		tempDom.appendChild(tempTool);
		_mask.top = tempTool;

		tempTool = renderElement("DIV", "mask");
		tempDom.appendChild(tempTool);
		_mask.bottom = tempTool;

		tempTool = renderElement("DIV", "mask");
		tempDom.appendChild(tempTool);
		_mask.left = tempTool;

		tempTool = renderElement("DIV", "mask");
		tempDom.appendChild(tempTool);
		_mask.right = tempTool;

		//加载img
		_img = renderElement("IMG", "img-cut");
		_cutImgCon.appendChild(_img);
		s = _img.style;
		s.padding = "0px";
		s.margin = "0px";
		s.border = "0px";
		_img.onselectstart = onselect;
		_this.loadImage(src);
		
		function renderFormPara(prompt, name){
			var inp, d;
			d = renderElement("DIV", "cut-img-infor");
			d.appendChild(renderElement("LABEL", "", prompt));
			inp = renderElement("INPUT", "", "0");
			inp.setAttribute("name", name);
            d.appendChild(inp);
            inp.onblur = _this.onBlurForm;
            return d;
		}
		
		function onselect(){
			return false;
		}
	}

	_this.initSize = function() {
		var w = parseInt(_img.offsetWidth);
		var h = parseInt(_img.offsetHeight);
		
		_size.viewWidth  = w;
		_size.viewHeight = h;
		
		_size.width = w;
		_size.height = h;
		
		_size.originalHeight = h;
		_size.originalWidth = w;
		
		//初始化
		_this.toolViewChange(w / 4, h / 4, w / 2, h / 2, 1);
		jDawn.bindEvent(document, 'mouseup', onMouseUp);
		jDawn.bindEvent(document, 'mousemove', onMouseMove);
	}
	
	//_size.ow _size.oh 显示
	_this.changeViewScale = function(w, h){
		var s = 1, x;
		if (w > _size.maxWidth){
			s = parseFloat((_size.maxWidth / w).toFixed(6));
		}
		
		_size.viewScale = s;
		_size.originalWidth = _size.viewWidth * s;
		_size.originalHeight = _size.viewHeight * s;
		
		_size.width = _size.originalWidth * _tool.scale;
		_size.height = _size.originalHeight * _tool.scale;
		
		_cutImgCon.style.width = _size.width + "px";
		_cutImgCon.style.height = _size.height + "px";
		
		_img.style.width = _size.width + "px";
		_img.style.height = _size.height + "px";
	}

	_this.changeSize = function(scale) {
		if (!scale || scale <= 0) {
			return;
		}
		_tool.scale = scale;
		_this.changeViewScale(_size.originalWidth * scale);
	}

	_this.toolViewChange = function(x, y, w, h, scale) {
		x = Math.floor(x);
		y = Math.floor(y);
		w = Math.floor(w);
		h = Math.floor(h);
		scale = parseFloat(scale);
		
		_this.changeSize(scale);

		if (x < 0) {
			x = 0;
		}
		if (y < 0) {
			y = 0;
		}

		if (w < _tool.minWidth) {
			w = _tool.minWidth;
		} else if (w > _size.width) {
			w = _size.width;
		}

		if (h < _tool.minHeight) {
			h = _tool.minHeight;
		} else if (h > _size.height) {
			h = _size.height;
		}

		if (x > _size.width - w) {
			x = _size.width - w;
		}
		if (y > _size.height - h) {
			y = _size.height - h;
		}

		_tool.x = x;
		_tool.y = y;
		_tool.height = h;
		_tool.width = w;

		_this.resetView();
		_this.showToolInfor();
	}

	_this.resetView = function() {
		//初始化遮罩层
		var s = _mask.left.style;
		s.left = "0px";
		s.top = "0px";
		s.width = _tool.x + "px";
		s.height = _size.height + "px";

		s = _mask.right.style;
		s.left = (_tool.x + _tool.width) + "px";
		s.top = "0px";
		s.width = (_size.width - _tool.x - _tool.width) + "px";
		s.height = _size.height + "px";

		s = _mask.top.style;
		s.left = _tool.x + "px";
		s.top = "0px";
		s.width = _tool.width + "px";
		s.height = _tool.y + "px";

		s = _mask.bottom.style;
		s.left = _tool.x + "px";
		s.top = (_tool.height + _tool.y) + "px";
		s.width = _tool.width + "px";
		s.height = (_size.height - _tool.y - _tool.height) + "px";

		//初始化工具
		s = _cutToolDom.style;
		s.left = (_tool.x - 1) + "px";
		s.top = (_tool.y - 1) + "px";
		s.width = _tool.width + "px";
		s.height = _tool.height + "px";

		//初始化矩形
		var l = _toolRects.length;
		var w, h, rect, rectH;
		w = _tool.width / 2;
		h = _tool.height / 2;
		rectH = parseInt(_toolRects[0].offsetHeight) / 2;
		for (var i = 0; i < l; i++) {
			if (i == 4) {
				continue;
			}
			s = _toolRects[i].style;
			s.left = ((i % 3) * w - rectH) + "px";
			s.top = (Math.floor(i / 3) * h - rectH) + "px";
		}

		//初始化虚线
		s = _lineRects.lineVertical.style;
		s.left = parseInt(_tool.width / 3) + 'px';
		s.top = '0px';
		s.width = s.left;
		s.height = _tool.height + 'px';

		s = _lineRects.lineAcross.style;
		s.top = parseInt(_tool.height / 3) + 'px';
		s.left = '0px';
		s.height = s.top;
		s.width = _tool.width + 'px';
	}

	//渲染元素
	function renderElement(tagName, className, value) {
		var dom = document.createElement(tagName);
		if (className) {
			dom.className = className;
		}
		if (value) {
			tagName = tagName.toUpperCase();
			if (tagName == "INPUT") {
				dom.value = value;
			} else if (tagName == "IMG") {
				dom.src = value;
			} else {
				dom.innerHTML = value;
			}
		}
		return dom;
	}

	//加载图片
	_this.loadImage = function(imgurl) {
		_img.style.width = "auto";
		_img.style.height = "auto";
		_cutImgCon.style.width = "auto";
		_cutImgCon.style.height = "auto";
		var img = new Image();
		img.src = imgurl;
		if (img.complete) {
			_img.src = imgurl;
			_this.initSize();
		} else {
			img.onload = function() {
				_img.src = imgurl;
				_this.initSize();
			};
		}
	}


	//拖拽事件
	var ifDrag = false;
	function onMouseMove(e) {
		if (ifDrag) {
			e = jDawn.getEvent(e);
			_mouse.xt = e.x;
			_mouse.yt = e.y;

			_mouse.dx = _mouse.xt - _mouse.x0;
			_mouse.dy = _mouse.yt - _mouse.y0;

			var dh = 0,
				dw = 0,
				dx = 0,
				dy = 0;
			switch (_mouse.type) {
				case "move":
					dx = _mouse.dx;
					dy = _mouse.dy;
					break;

				case "resize-right-down-t":
					dw = 0 - _mouse.dx;
					dh = parseInt(dw * _tool.height / _tool.width);
					dx = _mouse.dx;
					dy = 0 - dh;
					break;

				case "resize-right-down-b":
					dh = _mouse.dy;
					dw = parseInt(dh * _tool.width / _tool.height);
					break;

				case "resize-vertical-t":
					dh = 0 - _mouse.dy;
					dy = _mouse.dy;
					break;

				case "resize-vertical-b":
					dh = _mouse.dy;
					break;

				case "resize-left-down-t":
					dw = _mouse.dx;
					dh = parseInt(dw * _tool.height / _tool.width);
					dy = 0 - dh;
					break;

				case "resize-left-down-b":
					dh = _mouse.dy;
					dw = parseInt(dh * _tool.width / _tool.height);
					dx = 0 - dw;
					break;

				case "resize-across-l":
					dw = 0 - _mouse.dx;
					dx = _mouse.dx;
					break;

				case "resize-across-r":
					dw = _mouse.dx;
					break;

				default:
					return;
			}

			_mouse.x0 = _mouse.xt;
			_mouse.y0 = _mouse.yt;

			_this.toolViewChange(_tool.x + dx, _tool.y + dy, _tool.width + dw, _tool.height + dh);
		}
	}

	function onMouseDown(e) {
		ifDrag = true;
		e = jDawn.getEvent(e);
		var target = e.mouse.target || e.mouse.srcElement;
		var cursor = target.style.cursor;

		_mouse.type = target.type;
		_mouse.x0 = e.x;
		_mouse.y0 = e.y;

		_dragToolDom.style.cursor = cursor;
		_cutImgCon.style.cursor = cursor;
	}

	function onMouseUp() {
		ifDrag = false;
		_dragToolDom.style.cursor = "move";
		_cutImgCon.style.cursor = "default";
	}

	_this.showToolInfor = function() {
		_form.x.value = parseInt(_tool.x / _size.viewScale);
		_form.y.value = parseInt(_tool.y / _size.viewScale);
		_form.width.value = parseInt(_tool.width / _size.viewScale);
		_form.height.value = parseInt(_tool.height / _size.viewScale);
		_form.scale.value = parseFloat(_tool.scale);
	}
	_this.onBlurForm = function(){
		var form = _form;
		_this.changeToolInfor(form.x.value, form.y.value, form.width.value, form.height.value, form.scale.value);
	}
	_this.changeToolInfor = function(x, y, w, h, scale) {
		_size.viewScale = 1;
		_size.originalWidth = _size.viewWidth;
		_size.originalHeight = _size.viewHeight;
		_this.toolViewChange(x, y, w, h, scale);
	}
	_this.getToolInfor = function(){
		return {
			x: parseInt(_tool.x / _size.viewScale).toString(),
			y: parseInt(_tool.y / _size.viewScale).toString(),
			width: parseInt(_tool.width / _size.viewScale).toString(),
			height: parseInt(_tool.height / _size.viewScale).toString(),
			scale: parseFloat(_tool.scale).toString()
		};
	}
	_this.SetCutAction = function (func){
		_this.cutAction = func;
	}
	_this.doCutAction = function(){
		if (typeof _this.cutAction == "function"){
			_this.cutAction(_this.getToolInfor());
		}
	}
}