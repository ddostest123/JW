/*
 *$Author: pccold
 *$Date: 2015/07/01 11:11:04
 *$Revision: 1.001111
 *$Purpose: 通用js组件
 */
(

	function() {
		jDawn = new Object();
		//cookie过期标志字段
		jDawn.expiresSign = 'expires';
		
		jDawn.client = (function() {
			//呈现引擎 
			var engine = {
				name: '', //引擎名字ie Gecko Webkit KHTML Opera
				version: '' //版本号
			};

			//浏览器
			var browser = {
				name: '',
				version: ''
			};

			//平台、设备和操作系统
			var system = {
				system: '', //操作系统 win mac xll
				device: '' //设备 iphone android ipod ipad ios nokiaN winMobile
			};
			var ua = navigator.userAgent;
			if (window.opera) {
				engine.name = 'opera';
				engine.version = window.opera.version();
			} else if (/AppleWebKit\/(\S+)/.test(ua)) {
				engine.version = RegExp["$1"];
				engine.name = 'webkit';
				var webkit = parseFloat(engine.version);
				//确定是chrome还是safari
				if (/Chrome\/(\S+)/.test(ua)) {
					browser.name = 'chrome';
					browser.version = RegExp["$1"];
				}else if( /Version\/(\S+)/.test(ua)){
					browser.version = RegExp["$1"];
					browser.name = 'safari';
				}else{
					var safariVersion = 1;
					if (webkit < 100){
						safariVersion = 1;
					}else if (webkit < 312){
						safariVersion = 1.2;
					}else if (webkit < 412){
						safariVersion = 1.3;
					}else{
						safariVersion = 2;
					}
					browser.name = 'safari';
					browser.version = safariVersion;
				}
			}else if(/KHTML\/(\S+)/.test(ua) || /Kongqueror\/([^;]+)/.test(ua)){
				engine.version = browser.version = RegExp["$1"];
				engine.name = 'khtml';
				browser.name = 'Kong';
			}else if(/rv:([^\)]+)\) Gecko\/d{8}/.test(ua)){
				engine.version = RegExp["$1"];
				engine.name = 'gecko';
				
				//确定不是firefox
				if (/Firefox\/(\S+)/.test(ua)){
					browser.version = RegExp["$1"];
					engine.name = 'firefox';
				}
			}else if(/MSIE([^;]+)/.test(ua)){
				engine.name = 'ie';
				engine.version = browser.version = RegExp["$1"];
				browser.name = 'ie';
			}
			return {engine:engine, browser:browser};
		})();
		
		/*
		 * 获取url后面的拼接参数
		 * www.baidu.com?a=1$b=2c=3
		 * 返回对象 {a:1, b:2, c:3};
		 */
		jDawn.urlArgs = (function() {
			var locationSearch = window.location.search.substr(1);
			var l = locationSearch.length;
			if (l > 0) {
				var items = locationSearch.split("&");
				var item, name, i, value, args = {};
				l = items.length;
				for (i = 0; i < l; i++) {
					item = items[i].split("=");
					name = decodeURIComponent(item[0]);
					value = decodeURIComponent(item[1]);
					if (name.length) {
						args[name] = value;
					}
				}
				return args;
			} else {
				return null;
			}
		})();
		jDawn.addUrlAgrs = function (url, name, value){
			if (url.indexOf('?') != -1){
				return url + '&' + name + '=' + value;
			}else{
				return url + '?' + name + '=' + value;
			}
		};

		/*
		 * 获取浏览器cookie 值
		 */
		jDawn.getCookie = function(name) {
			var cookie, prefix, start, end;
			cookie = document.cookie;
			prefix = name + "=";
			start = cookie.indexOf(prefix);
			if (start == -1) {　　
				return null;　　
			}

			start += prefix.length;　
			end = cookie.indexOf(";", start);
			if (end == -1) {　
				value = cookie.substr(start);
			} else {
				value = cookie.substring(start, end);
			}

			return unescape(value);
		};

		/*
		 * 设置cookie
		 */
		jDawn.setCookie = function(name, value, effectiveDays) {
			document.cookie = name + '=' + value;
			if (typeof effectiveDays == 'number') {
				var cookieSign = jDawn.expiresSign;
				var expireDate;
				expireDate = new Date();
				expireDate.setTime(expireDate.getTime() + effectiveDays * 24 * 60 * 60 * 1000);
				document.cookie = name + '_' + cookieSign + '=' + expireDate.toGMTString();
			}
		};
		
		/*
		 * 获取元素byId
		 */
		jDawn.getElementById = function(id) {
			if (typeof(id) == "string") {
				if (document.getElementById) {
					return document.getElementById(id);
				} else if (document.all) {
					return document.all[id];
				}
			} else {
				return id;
			}
		};
		
		jDawn.renderElement = function(tagName, className, value) {
            var d = document.createElement(tagName);
            d.className = className || '';
            if (tagName.toUpperCase() != 'INPUT'){
            	d.innerHTML = value || '';
            }else{
            	d.value = value || '';
            }
            return d;
        };
		
		/*
		 * event 为添加事件模型 click blur load
		 * eventModel : true ：捕获事件  false:冒泡事件  默认 false
		 */
		jDawn.bindEvent = function(target, eventName, func, eventModel) {
			target = jDawn.getElementById(target);
			eventModel = (typeof(eventModel) == "boolean") ? eventModel : false;
			if (target.attachEvent) {
				target.attachEvent("on" + eventName, func);
			} else {
				target.addEventListener(eventName, func, eventModel);
			}
		};

		jDawn.getEvent = function(e) {
			var e = e || window.event;
			var evt = new Object();
			evt.mouse = e;
			evt.x = e.pageX || (e.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft));
			evt.y = e.pageY || (e.clientY + (document.documentElement.scrollTop || document.body.scrollTop));
			return evt;
		};

		/*
		 * object对象
		 * {pageWidth:1366, pageHeight:768};
		 * pageWidth：页面宽度
		 * pageHeight：页面高度 不计算滚动条的高度
		 */
		jDawn.getPageSize = function(w) {
			w = w || window;
			if (typeof w.innerWidth == "number") {
				return {
					pageWidth: w.innerWidth,
					pageHeight: w.innerHeight
				};
			} else if (w.document.compatMode == "CSS1Compat") {
				return {
					pageWidth: w.document.documentElement.clientWidth,
					pageHeight: w.document.documentElement.clientHeight
				};
			} else {
				return {
					pageWidth: w.document.body.clientWidth,
					pageHeight: w.body.clientHeight
				};
			}
		};

		//HTTPRequest
		jDawn.getHTTPRequest = function() {
			var xhrObj = null;
			try {
				xhrObj = new XMLHttpRequest();
			} catch (e) {
				var progid = ['MSXML2.XMLHTTP.5.0', 'MSXML2.XMLHTTP.4.0', 'MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP', 'Microsoft.XMLHTTP'];
				for (var i = 0; i < 5; i++) {
					try {
						xhrObj = new ActiveXObject(progid[i]);
					} catch (e) {
						continue;
					}
					break;
				}
			} finally {
				return xhrObj;
			}
		};
		
		/*
		 * 对象类名相关
		 */
		jDawn.getClass = function(target) {
			target = jDawn.getElementById(target);
			return target.className;
		};
		jDawn.setClass = function(target, className) {
			target = jDawn.getElementById(target);
			target.className = className;
		};
		jDawn.addClass = function(target, className) {
			target = jDawn.getElementById(target);
			if (!target.className){
				target.className = className;
			}else if(target.className.indexOf(className) == -1){
				target.className += ' ' + className;
			}
		};
		jDawn.removeClass = function(target, className) {
			target = jDawn.getElementById(target);
			target.className = target.className.replace(new RegExp(' ' + className + "|" + className, 'g'), "");
		};

		//拖拽组件
		jDawn.dragInitObject = function(){
			if (jDawn.dragObjStyle){
				return jDawn.dragObjStyle;
			}else{
				var div = document.createElement('DIV');
				div.onselectstart = function (){return false;};
				document.body.appendChild(div);
				var divStyle = div.style;
				divStyle.border = '1px dashed #ccc';
				divStyle.zIndex = '10000';
				divStyle.cursor = 'move';
				divStyle.position = 'fixed';
				divStyle.visibility = 'hidden';
				divStyle.display = 'none';
				jDawn.dragObjStyle = divStyle;
				return divStyle;
			}
		};
		
		/*
		 * 拖拽对象
		 * clickDiv：触发拖拽的物体
		 * moveDiv：拖拽的物体
		 * returnFunc：每次拖拽物体的回调函数
		 */
		jDawn.dragDom = function(clickDiv, moveDiv, returnFunc) {
			moveDiv = moveDiv || clickDiv;
			var parent = window;
			while (parent.parent != parent) {
				parent = parent.parent;
				jDawn.bindEvent(parent, 'mouseup', onMouUp);
			}
			
			jDawn.bindEvent(clickDiv, 'mousedown', onMouDown);
			jDawn.bindEvent(document, 'mouseup', onMouUp);
			jDawn.bindEvent(document, 'mousemove', onMouMove);
			
			var x0 = 0;
			var y0 = 0;
			var pageSize;
			
			var changeX, changeY, xL, yL;
			var moveObj = jDawn.dragInitObject();
			var tgrStyle = moveDiv.style;
			var ifDrag = false;
			var clickTime = 0;

			function onMouMove(e) {
				if (ifDrag) {
					pageSize = jDawn.getPageSize();
					e = jDawn.getEvent(e);
					changeX = e.x - x0;
					changeY = e.y - y0;
					if ((changeX > 0 && xL + changeX < pageSize.pageWidth - moveDiv.offsetWidth) ||
						(changeX < 0 && xL + changeX > -1)) {
						xL += changeX;
						tgrStyle.left = xL + "px";
					}
					if ((changeY > 0 && yL + changeY < pageSize.pageHeight - moveDiv.offsetHeight) ||
						(changeY < 0 && yL + changeY > -1)) {
						yL += changeY;
						tgrStyle.top = yL + "px";
					}
					x0 = e.x;
					y0 = e.y;
				}
			}
			function onMouDown(e) {				
				ifDrag = true;
						
				e = jDawn.getEvent(e);
				x0 = e.x;
				y0 = e.y;
				
				xL = parseFloat(tgrStyle.left) || 0;
				yL = parseFloat(tgrStyle.top) || 0;
				
				moveObj.visibility = 'visible';
				moveObj.width = moveDiv.offsetWidth + 'px';
				moveObj.height = moveDiv.offsetHeight + 'px';
				moveObj.left = xL + 'px'; 
				moveObj.top = yL + 'px';
				moveObj.display = 'block';
				
			}
			function onMouUp() {
				ifDrag = false;		
				
				moveObj.display = 'none';
				moveObj.visibility = 'hidden';
				
				if (typeof returnFunc == 'function'){
					returnFunc(moveDiv, xL, yL);
				} 
			}
		};
		
		/*
		 * 拖拽对象(正对小模块拖拽)
		 * 修改人： lokya
		 * clickDiv：触发拖拽的物体
		 * moveDiv：拖拽的物体
		 * returnFunc：每次拖拽物体的回调函数
		 */
		jDawn.dragDomNew = function(clickDiv, moveDiv, returnFunc) {
			moveDiv = moveDiv || clickDiv;
			var parent = window;
			while (parent.parent != parent) {
				parent = parent.parent;
				jDawn.bindEvent(parent, 'mouseup', onMouUp);
			}
			
			jDawn.bindEvent(clickDiv, 'mousedown', onMouDown);
			jDawn.bindEvent(document, 'mouseup', onMouUp);
			jDawn.bindEvent(document, 'mousemove', onMouMove);
			
			var x0 = 0;
			var y0 = 0;
			var pageSize;
			
			var changeX, changeY, xL, yL;
			var moveObj = jDawn.dragInitObject();
			var tgrStyle = moveDiv.style;
			var ifDrag = false;
			var clickTime = 0;

			function onMouMove(e) {
				if (ifDrag) {
					pageSize = jDawn.getPageSize();
					e = jDawn.getEvent(e);
					changeX = e.x - x0;
					changeY = e.y - y0;
					if ((changeX > 0 && xL + changeX < pageSize.pageWidth - moveDiv.offsetWidth) ||
						(changeX < 0 && xL + changeX > -1)) {
						xL += changeX;
						tgrStyle.left = xL + "px";
					}
					if ((changeY > 0 && yL + changeY < pageSize.pageHeight - moveDiv.offsetHeight) ||
						(changeY < 0 && yL + changeY > -1)) {
						yL += changeY;
						tgrStyle.top = yL + "px";
					}
					x0 = e.x;
					y0 = e.y;
				}
			}
			function onMouDown(e) {	
				ifDrag = true;
				createMoveDom();		
				e = jDawn.getEvent(e);
				x0 = e.x;
				y0 = e.y;			
				
				//xL = parseFloat(tgrStyle.left) || 0;
				//yL = parseFloat(tgrStyle.top) || 0;
				
				xL = parseFloat(moveDiv.offsetLeft) || 0;
				yL = parseFloat(moveDiv.offsetTop) || 0;
				
				moveObj.visibility = 'visible';
				moveObj.width = moveDiv.offsetWidth + 'px';
				moveObj.height = moveDiv.offsetHeight + 'px';
				moveObj.left = xL + 'px'; 
				moveObj.top = yL + 'px';
				moveObj.display = 'block';
				
			}
			function onMouUp() {
				ifDrag = false;	
				moveObj.display = 'none';
				moveObj.visibility = 'hidden';
				
					
				removeMoveDom();
				
				if (typeof returnFunc == 'function'){
					returnFunc(moveDiv, xL, yL);
				} 
			}
			//创建新模态层 防止底部页面对拖拽时间屏蔽
			function createMoveDom(){
				pageSize = jDawn.getPageSize();
				var coverDom = document.getElementById("coverDom");
				if(!coverDom){
					coverDom = document.createElement("DIV");
					coverDom.style.width = pageSize.pageWidth + "px";
					coverDom.style.height = pageSize.pageHeight + "px";
					coverDom.style.position = "absolute";
					coverDom.style.zIndex = 40;
					coverDom.style.background = "rgba(255,255,255,0)";	
					coverDom.id = "coverDom";
					coverDom.style.top = "0px";				
					var domAdd = document.querySelector(".hand-main-content");
					domAdd.appendChild(coverDom);
				}else{
					coverDom.style.display = "block";
				}				
			}
			//隐藏模态层
			function removeMoveDom(){
				var coverDom = document.getElementById("coverDom");
				if(coverDom){
					coverDom.style.display = "none";
				}
			}
		};
		
		
		//深度复制 问题：无法引用已释放的对象
		//注：如果存在子节点绑定父节点 堆栈溢出 死循环
		jDawn.deepCopy= function(source) {
			var result = new Object();
			for (var key in source) {
				result[key] = typeof source[key]=== 'object' ? jDawn.deepCopy(source[key]) : source[key];
			} 
			return result;
		};
		
		/*
		 * 页面加载文件 js css
		 * filename 文件名称
		 * filetype 文件类型
		 */
		jDawn.loadjscssfile = function(filename, filetype){
			var fileref;
			if(filetype == "js"){
				fileref = document.createElement('script');
				fileref.setAttribute("type","text/javascript");
				fileref.setAttribute("src",filename);
			}else if(filetype == "css"){
				fileref = document.createElement('link');
				fileref.setAttribute("rel","stylesheet");
				fileref.setAttribute("type","text/css");
				fileref.setAttribute("href",filename);
			}
		   	if(fileref){
				document.getElementsByTagName("head")[0].appendChild(fileref);
			}
		};
		
		/*
		 * Tween的算法
		 */
		jDawn.tween = {
			Linear: function(t,b,c,d){ return c*t/d + b; },
			Quad: {
				easeIn: function(t,b,c,d){
					return c*(t/=d)*t + b;
				},
				easeOut: function(t,b,c,d){
					return -c *(t/=d)*(t-2) + b;
				},
				easeInOut: function(t,b,c,d){
					if ((t/=d/2) < 1) return c/2*t*t + b;
					return -c/2 * ((--t)*(t-2) - 1) + b;
				}
			},
			Cubic: {
				easeIn: function(t,b,c,d){
					return c*(t/=d)*t*t + b;
				},
				easeOut: function(t,b,c,d){
					return c*((t=t/d-1)*t*t + 1) + b;
				},
				easeInOut: function(t,b,c,d){
					if ((t/=d/2) < 1) return c/2*t*t*t + b;
					return c/2*((t-=2)*t*t + 2) + b;
				}
			},
			Quart: {
				easeIn: function(t,b,c,d){
					return c*(t/=d)*t*t*t + b;
				},
				easeOut: function(t,b,c,d){
					return -c * ((t=t/d-1)*t*t*t - 1) + b;
				},
				easeInOut: function(t,b,c,d){
					if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
					return -c/2 * ((t-=2)*t*t*t - 2) + b;
				}
			},
			Quint: {
				easeIn: function(t,b,c,d){
					return c*(t/=d)*t*t*t*t + b;
				},
				easeOut: function(t,b,c,d){
					return c*((t=t/d-1)*t*t*t*t + 1) + b;
				},
				easeInOut: function(t,b,c,d){
					if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
					return c/2*((t-=2)*t*t*t*t + 2) + b;
				}
			},
			Sine: {
				easeIn: function(t,b,c,d){
					return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
				},
				easeOut: function(t,b,c,d){
					return c * Math.sin(t/d * (Math.PI/2)) + b;
				},
				easeInOut: function(t,b,c,d){
					return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
				}
			},
			Expo: {
				easeIn: function(t,b,c,d){
					return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
				},
				easeOut: function(t,b,c,d){
					return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
				},
				easeInOut: function(t,b,c,d){
					if (t==0) return b;
					if (t==d) return b+c;
					if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
					return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
				}
			},
			Circ: {
				easeIn: function(t,b,c,d){
					return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
				},
				easeOut: function(t,b,c,d){
					return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
				},
				easeInOut: function(t,b,c,d){
					if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
					return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
				}
			},
			Elastic: {
				easeIn: function(t,b,c,d,a,p){
					if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
					if (!a || a < Math.abs(c)) { a=c; var s=p/4; }
					else var s = p/(2*Math.PI) * Math.asin (c/a);
					return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
				},
				easeOut: function(t,b,c,d,a,p){
					if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
					if (!a || a < Math.abs(c)) { a=c; var s=p/4; }
					else var s = p/(2*Math.PI) * Math.asin (c/a);
					return (a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b);
				},
				easeInOut: function(t,b,c,d,a,p){
					if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
					if (!a || a < Math.abs(c)) { a=c; var s=p/4; }
					else var s = p/(2*Math.PI) * Math.asin (c/a);
					if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
					return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
				}
			},
			Back: {
				easeIn: function(t,b,c,d,s){
					if (s == undefined) s = 1.70158;
					return c*(t/=d)*t*((s+1)*t - s) + b;
				},
				easeOut: function(t,b,c,d,s){
					if (s == undefined) s = 1.70158;
					return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
				},
				easeInOut: function(t,b,c,d,s){
					if (s == undefined) s = 1.70158; 
					if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
					return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
				}
			},
			Bounce: {
				easeIn: function(t,b,c,d){
					return c - Tween.Bounce.easeOut(d-t, 0, c, d) + b;
				},
				easeOut: function(t,b,c,d){
					if ((t/=d) < (1/2.75)) {
						return c*(7.5625*t*t) + b;
					} else if (t < (2/2.75)) {
						return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
					} else if (t < (2.5/2.75)) {
						return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
					} else {
						return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
					}
				},
				easeInOut: function(t,b,c,d){
					if (t < d/2) return Tween.Bounce.easeIn(t*2, 0, c, d) * .5 + b;
					else return Tween.Bounce.easeOut(t*2-d, 0, c, d) * .5 + c*.5 + b;
				}
			}
		};
	}
)();