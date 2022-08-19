/*
 * 使用说明 使用ul标签 名称为'handPlayMovie' 即可
 *   <ul name="handPlayMovie">
 *   	<li></li>
 *   	<li></li>
 *   	<li></li>
 * 	</ul>
 */
(function() {
	var objList = window.document.getElementById('handPlayMovieId');
	addMovefunc(objList);
	function addMovefunc(obj) {
		var timer = {
			delay : 10,
			repeatCount : 0,
			running : true,
			pauseTime : 300,
			clickTime : 0
		};
		var handPlayMovie = {
			timerSign : 0,
			width : 0,
			x : 0
		};
		var parent = obj;
		var children = parent.children;
		var num = children.length, spans = [], childNodes = [];
		var w = parseInt(parent.parentNode.offsetWidth);
		var h = parseInt(parent.parentNode.offsetHeight);

		handGlobal.setClassName(parent, parent.getAttribute('class')
				+ ' hand-play-movie-con');
		parent.style.width = (w * num + 1000) + 'px';
		parent.style.height = h + 'px';
		parent.style.marginTop = '0px';
		parent.style.marginLeft = '0px';
		parent.x = 0;
		parent.y = 0;

		var destinationX = -1 * w, destinationY = 0, targetSign = 0, derection = 0, changSign = 0;
		initSpanAndChildrenLocal();
		handPlayMovie.timerSign = setInterval(movePic, timer.delay);

		// 初始化列表的坐标 以及 标签
		function initSpanAndChildrenLocal() {
            if(num != 0){
			var div, span;
			div = window.document.createElement('DIV');
			div.className = 'hand-play-movie-label-con';
			// div.style.top = (h - 26) + 'px';
			div.style.top = (350 - 26) + 'px';
			div.style.left = ((w - 30 * num - 5 * (num - 1))) / 2 - 5 + 'px';
			for (var i = 0; i < num; i++) {
				// 下方标签
				span = window.document.createElement('SPAN');
				spans.push(span);
				span.sign = i;
				span.className = 'normal';
				span.innerHTML = i + 1;
				span.onclick = onClickLabel;
				div.appendChild(span);

				// 初始化子节点
				childNodes.push(children[0]);
				parent.removeChild(childNodes[i]);
				childNodes[i].style.width = w + 'px';
				childNodes[i].style.height = h + 'px';
			}
				parent.appendChild(childNodes[1]);
				parent.appendChild(childNodes[0]);
				parent.style.marginLeft = destinationX + 'px';
				parent.parentNode.appendChild(div);
				spans[0].className = 'normal hand-play-active';
				//console.log(childNodes);
			}
		}

		/*
		 * t：current time（当前时间）； b：beginning value（初始值）； c： change in
		 * value（变化量）； d：duration（持续时间）。
		 */
		var d = parent.getAttribute('duration-time') ? parent
				.getAttribute('duration-time') : 60;
		var c = 0;
		var D = 0;
		var b = 0;
		var t = d + 1;
		var type = parent.getAttribute('type');
		var pStyle = parent.style;
		function movePic() {
			if (t < d) {
				t++;
				D = tween(t, b, c, d);
				pStyle.marginLeft = D + 'px';
			} else {
				timer.repeatCount++;
				if (timer.repeatCount > timer.pauseTime) {
					if (targetSign == num - 1) {
						changSign = -1 * num + 1;
					} else if (targetSign == 0) {
						changSign = 1;
					}
					timer.repeatCount = 0;
					
					resetDestination(targetSign + changSign);
				}
			}
		}

		function tween(t, b, c, d) {
			if (type == 'Bounce') {
				if ((t /= d) < (1 / 2.75)) {
					return c * (7.5625 * t * t) + b;
				} else if (t < (2 / 2.75)) {
					return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
				} else if (t < (2.5 / 2.75)) {
					return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
				} else {
					return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375)
							+ b;
				}
			} else if (type == 'Quartic') {
				if ((t /= d / 2) < 1)
					return c / 2 * t * t * t * t + b;
				return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
			} else {
				return c * (t /= d) * t * t * t * t + b;
			}
		}

		function onClickLabel(e) {
			e = e || event;
			var tgr = e.currentTarget || e.srcElement;
			while (tgr.nodeName != 'SPAN') {
				tgr = tgr.parentNode;
			}
			resetDestination(tgr.sign);
		}

		function resetDestination(sign) {
			
			if (targetSign == sign) {
				return;
			}
			
			if(spans.length !=0){
			spans[targetSign].className = 'normal';
			spans[sign].className = 'normal hand-play-active';
			parent.removeChild(children[0]);
			parent.appendChild(childNodes[sign]);
			pStyle.marginLeft = '0px';
			b = 0;
			targetSign = sign;

			t = 0;
			timer.repeatCount = 0;
			c = destinationX;
//			console.log(spans);
			}else{}
			
		}
	}

})();