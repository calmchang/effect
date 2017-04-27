
;(function (root, factory) {
var name = "ProgressValue";
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
	 * 控制变量变换的类，特点是会控制变量 从初始值到结束值，再从结束值回到初始值（支持贝塞尔曲线）
	 * @param {[type]} options {
	 *   from:起始值,
	 *   to:目标值,
	 *   time:整个流程需要的总时间(单位:ms)
	 *   tween:使用的缓动效果类型（如果不填默认为Linear)
	 *         tween为nnCG.Tween库下的缓动效果
	 *   bezier:贝塞尔曲线参数[参数1，参数2，参数3，参数4]，如果存在这个tween则不生效
	 *   
	 * }
	 */
	function ProgressValue(options, nnCGTween){
		

		this.value = this.from = options.from||0;
		this.to= options.to||0;

		this.time=options.time/2;
		this.curTime=0;
		this.bezier = options.bezier || null;
		this.Tween = nnCGTween || nnCG.Tween;
		if( options.bezier ){
			this.tween='bezier';
		}else{
			this.tween = options.tween ||  this.Tween.Linear;
		}
		this.dir = 1;//1代表正向播放，-1代表逆向播放，0代表结束
	}

	ProgressValue.prototype.reset= function(){
		this.value= this.from;
		this.curTime = 0;
		this.dir = 1;
	};
	ProgressValue.prototype.destory= function(){
		this.Tween=null;
	};

	/**
	 * 计算进度
	 * @param  {[type]} ms [当前流失的时间ms值]
	 * @return {[type]}    [计算后的结果值]
	 */
	ProgressValue.prototype.run= function(ms){
		if( this.dir === 0 )return false;//代表已经播放完毕

		var from = 0;
		var to = 1;

		if( this.dir === 1 ){
			from = this.from;
			to = this.to;
		}else{
			from = this.to;
			to = this.from;
		}

		if( this.tween === 'bezier' ){
			this.value = this.Tween.BezierByX(from, to, this.curTime, this.time, this.bezier[0],this.bezier[1],this.bezier[2], this.bezier[3]);
		}else{
			this.value = this.tween(this.curTime, from, (to-from), this.time);
		}

		this.curTime+=ms;
		if( this.curTime >= this.time ){
			if( this.dir === 1 ){
				this.dir= -1;
				this.curTime = 0;
			}else{
				this.dir= 0;
			}
		}


		return true;

	};
	
	return ProgressValue;

});
