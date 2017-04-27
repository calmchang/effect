
;(function (root, factory) {
var name = "Tween";
	if(typeof exports === 'object' && typeof module === 'object'){
		console.log( name + "init by module.exports");
		module.exports = factory();
	}
	else if(typeof define === 'function' && define.amd){
		console.log( name +  "init by define");
		define([], factory);
	}
	else if(typeof exports === 'object'){
		console.log( name + "init by exports."+name);
		exports[name] = factory();
	}
	else{
		console.log( name + "init by window.nnCG."+name);
		if( typeof root.nnCG === 'undefined' ){
        root.nnCG={};
    }
    root.nnCG[name] = factory();
	}
})(this||window, function() {
/**
	 * Tween基础缓动 
	 * @param {Integer} t	[当前时间点（如1000毫秒)]
	 * @param {Integer} d [为结束时间点(如5000毫秒)]
	 * @param {Integer} b [起始的值（如X坐标出生点的值）]
	 * @param {Integer} c [终点的值（如X坐标最终目标点的值）]
	 * @return {Integer} [当前时间点应该的值是多少]
	 */
	var Tween = {
		//当前事件，出生点，目标点，一共需要时间
		//目标点*当前时间/总时间+出生点
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
		},
		/**
		 * 3阶贝塞尔曲线
		 * B(t) = P0*(1-t)³ + 3*t*P1*(1-t)² + 3*t²*P2*(1-t)  t∈[0,1]
		 * @param {Integer} px1,px2,py1,py2(0,0,1,1) 2个控制点的坐标可直接复制 http://cubic-bezier.com/ 的参数
		 * @param {Integer} t [当前时间 取值范围(0~1)]
		 * @param {Integer} 当前的值{x:0,y:0}
		 */
			Bezier: function(px1,py1,px2,py2,t){
				var p=[
					{x:0,y:0},
					{x:px1,y:py1},
					{x:px2,y:py2},
					{x:1,y:1}
				];

				var n = 1-t;
				var x = n*n*n*p[0].x + 3.0*p[1].x*t*n*n + 3.0*p[2].x*t*t*n + p[3].x*t*t*t;
				var y = n*n*n*p[0].y + 3.0*p[1].y*t*n*n + 3.0*p[2].y*t*t*n + p[3].y*t*t*t;
				return {x:x, y:y};
			},
			/**
			 * 利用贝塞尔曲线通过一个变量的起始和结束值，获取当前变量的值
			 * @param {[type]} startX  [变量的初始值]
			 * @param {[type]} endX    [变量的目标值]
			 * @param {[type]} curTime [当前时间]
			 * @param {[type]} endTime [目标时间]
			 * @param {[type]} px1     [贝塞尔控制点1的X轴值 可直接复制 http://cubic-bezier.com/ 生成的4个参数进来]
			 * @param {[type]} py1     [贝塞尔控制点1的Y轴值 可直接复制 http://cubic-bezier.com/ 生成的4个参数进来]
			 * @param {[type]} px2     [贝塞尔控制点2的X轴值 可直接复制 http://cubic-bezier.com/ 生成的4个参数进来]
			 * @param {[type]} py2     [贝塞尔控制点2的Y轴值 可直接复制 http://cubic-bezier.com/ 生成的4个参数进来]
			 */
			BezierByX:function(startX,endX,curTime,endTime,px1,py1,px2,py2){
				return this.BezierByXY(
					{x:startX, y:1},
					{x:endX,   y:1},
					curTime,endTime,
					px1,py1,px2,py2).x;
			},
			/**
			 * 同上面的区别是可以同时获取xy的值
			 */
			BezierByXY:function(start,end,curTime,endTime,px1,py1,px2,py2){
				var t = 1.0 / ( endTime - 1 ) * curTime;
				var result = this.Bezier(px1,py1,px2,py2,t);
				result.bz={x:result.x,y:result.y};

			  result.x = start.x + (end.x - start.x)*result.x;
			  result.y = start.y + (end.y - start.y)*result.y;
			  //console.log(result.x+','+result.y);
				return result;
			},

	};

	return Tween;

});


