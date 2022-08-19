/*
 * author:pccold
 * purpose: 运动
 * 注：暂时只支持直线运动
 * 
 * 使用方法:	handMove.initRun(div, purpose, time, moveType);
 * 到达位置：purpose:{x:0, y:100} 如果只想改变y可以为{y:100}
 * moveType:运动类型 默认{tween:'Quadratic', ease:'easeIn'}
 * tween:['Linear', 'Quad', 'Cubic','Quart','Quint',' Sine','Expo','Circ','Elastic','Back','Bounce']
 * ease:['easeIn','easeOut','easeInOut']
 * 
 * 运动算法来源：http://www.robertpenner.com/easing/
 * 向作者致敬 
 */
var handMove = {
	$ : function (id) {
		return "string" == typeof id ? document.getElementById(id) : id;
	},
	tween: {
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
	},
	initRun: function(div, returnFun, purpose, time, moveType){
		if (!time){
			time = 50;
		}
		if(!moveType || !moveType.tween){
			moveType = {tween:'Linear', ease:'easeIn'};
		}else if(!moveType.ease){
			moveType.ease = 'easeIn';
		}
		var _delay = 10, _timer, d = Math.floor(time * 1000 / _delay);
		var _tweenFun = moveType.tween == "Linear" ? handMove.tween.Linear : handMove.tween[moveType.tween][moveType.ease];
		if (!_tweenFun){
			_tweenFun = handMove.tween.Linear;
		}
		var _moveFunc, _x0, _y0, _xt, _yt, _target;
		var cx, cy, ss, t = 0, c, D, A;
		
		initPosition();
		if (cx == 0 && cy == 0){
			return;
		}
		_moveFunc();
		
		//初始化数据
		function initPosition(){
			var a;
			_xt = purpose.x;
			_yt = purpose.y;
			
			_target = handMove.$(div);
			if (!_target){
				alert('Try move null object');
				return;
			}
			ss = _target.style;
			a = parseInt(ss.left);
			if (a){
				_x0 = a;
			}else{
				_x0 = 0;
			}
			a = parseInt(ss.top);
			if (a){
				_y0 = a;
			}else{
				_y0 = 0;
			}
			if (_xt == null || _xt === ''){
				_xt = _x0;
			}
			if (_yt == null || _yt === ''){
				_yt = _y0;
			}
			
			//判定移动类型
			cx = _xt - _x0;
			cy = _yt - _y0;
			c = Math.pow(cx * cx + cy * cy, 0.5);
			if(cx == 0){
				_moveFunc = moveY;
				if (_yt == _y0){
					cy = 0;
				}else{
					cy = _yt - _y0;
				}
			}else{
				_moveFunc = moveX;
				A = Math.atan(cy / cx);
			}
		}
		
		
		/*
		 * t：current time（当前时间）；  
		 * b：beginning value（初始值）； 
		 * c： change in value（变化量）； 
		 * d：duration（持续时间）。
		 */
		function moveX(){
			if(t < d){
				t++;
				D = _tweenFun(t, 0, c, d);
				ss.left = Math.ceil(_x0 + D * Math.cos(A)) + 'px';
				ss.top = Math.ceil(_y0 + D * Math.sin(A)) + 'px';
				_timer = setTimeout(moveX, _delay);
			}else{
				ss.left = _xt + "px";
				if (cy != 0){
					ss.top = _yt + 'px';
				}
				clearTimeout(_timer);
				if(returnFun){
					returnFun();
				}
			}
		}
		
		//移动函数
		function moveY(){
			if(t<d){
				t++;
				ss.top = Math.ceil(_tweenFun(t, _y0, cy, d)) + 'px';
				_timer = setTimeout(moveY, _delay);
			}else{
				ss.top = _yt + "px";
				clearTimeout(_timer);
				if(returnFun){
					returnFun();
				}
			}
		}
	},
	initBezierCurve: function(sp, returnFun, time, p1, p2, p3, p4) {
		var count = 0;
		var lineX = 0;
		var lineY = 0;
		var t = 0,
			timer;
		var _delay = time * 10;
		var spriteStyle = sp.style;
		var func;
		if (p4) {
			func = ThreeTimesBezierFormulas;
		} else {
			func = QuadraticBezierFormulas;
		}
		timer = setTimeout(onMoveTimer, _delay);

		function onMoveTimer() {
			t += 0.01;
			func();
			spriteStyle.left = lineX + 'px';
			spriteStyle.top = lineY + 'px';
			if (t < 1) {
				timer = setTimeout(onMoveTimer, _delay);
			} else{
				clearTimeout(timer);
				if(returnFun){
					returnFun();
				}
			}
		}

		function ThreeTimesBezierFormulas() {
			lineX = Math.pow((1 - t), 3) * p1.x + 3 * p2.x * t * (1 - t) * (1 - t) + 3 * p3.x * t * t * (1 - t) + p4.x * Math.pow(t, 3);
			lineY = Math.pow((1 - t), 3) * p1.y + 3 * p2.y * t * (1 - t) * (1 - t) + 3 * p3.y * t * t * (1 - t) + p4.y * Math.pow(t, 3);
		}

		function QuadraticBezierFormulas() {
			lineX = Math.pow((1 - t), 2) * p1.x + 2 * t * (1 - t) * p2.x + Math.pow(t, 2) * p3.x;
			lineY = Math.pow((1 - t), 2) * p1.y + 2 * t * (1 - t) * p2.y + Math.pow(t, 2) * p3.y;
		}
	}
};