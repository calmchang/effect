
;(function (root, factory) {
var name = "nnEsFloats";
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
		console.log( name + "init by window.nnUtil."+name);
		if( typeof root.nnUtil === 'undefined' ){
        root.nnUtil={};
    }
    root.nnUtil[name] = factory();
	}
})(this||window, function() {

	function cxFloat(options){
		this.born={x:options.x||0, y:options.y||0};//出生点
		
		this.dest={
			x:0, y:0, //移动偏移量
		};
		this.mode="sprite";//模式 sprite精灵
		this.delay=0;//到达目标后的delay时间
		this.radius=10;//游动范围，如果游动范围为0代表不游动，如果游动范围为-1代表随机游动
		this.speed=1;//移动速度
		this.size={
			value:1,
			from:1,
			to:2,
			speed:2,
			direction:"alternate"
		};
		this.alpha={//半透明渐变过程
			value:0.5,
			from:0.5, //渐变起始值
			to:1,//渐变目标值
			speed:0.1,//渐变速度
			tick:1,//多少帧变化一次
			direction:"alternate",//是否逆向变化
			dir:1,
		};
		this.tick=0;

	}
	cxFloat.prototype.run= function(options){
		this.tick++;
		if( this.tick%this.alpha.tick === 0 ){
			if( this.alpha.dir === 1 ){
				this.alpha.value += this.alpha.speed;
				if( this.alpha.value >= this.alpha.value.to ){
					if( this.alpha.direction === 'alternate' ){
						this.alpha.value=this.alpha.value.to;
						this.alpha.dir = -1;
					}else{
						this.alpha.value=this.alpha.value.from;
					}
				}
			}else{
				this.alpha.value -= this.alpha.speed;
				if( this.alpha.value <= this.alpha.value.from ){
					this.alpha.value= this.alpha.value.from;
					this.alpha.dir = 1;
				}
			}
		}


	};


	function cxFloats(option)
	{
		this.child=[];
		this.imgSrc = '';
		this.imgPar = [];
		this.canvasID = options.canvasID;
		window.Graphics = (window.nnUtil.nnGraphics);
	}
	
	cxFloats.prototype.push = function(options){
		var sprite = new cxFloat(options);
		this.child.push(sprite);
	};


	cxFloats.prototype.loaded = function(callback)
	{
		var img = new Image();
		var self = this;
		img.onload = function(e)
		{
			self.imgPar.push(img);
			if( !callback ){
				self.start();
				return;
			}
			if(callback)callback();
		};
		img.src= self.imgSrc;
	};
	
	
	
	cxFloats.prototype.getGraphics = function()
	{
		if( this.gGraphics === null )
		{
			this.gGraphics = new Graphics( document.getElementById( this.canvasID ) );
		}

		return this.gGraphics;
	};

	cxFloats.prototype.start = function()
	{	
		var self = this;
		self.canvasTimer1 = setInterval(function()
		{
			self.run();
		},24);
		
	};

	cxFloats.prototype.stop = function()
	{
		window.clearInterval( this.canvasTimer1 );
	};

	cxFloats.prototype.run = function(callback)
	{
		var graphics = this.getGraphics();
		graphics.blendmode = Graphics.BlendMode.Transparent;
		
		//graphics.clear('transparent');
		graphics.fillRect(0,0,graphics.width,graphics.height,"rgba(0,0,0,0.5)");

		graphics.blendmode = Graphics.BlendMode.Normal;

		this.runcount++;


		
		for( var i = 0 ; i < this.child.length ; i++ )
		{
			var p = this.child[i];
			if( p === null || p.run() === false )
			{
				p.destory();
				this.child.splice(i,1);
				i--;
				continue;
			}

			graphics.setAlpha(  1*p.alpha.value/255 );
	
			if( p.size > 0 ){
				graphics.drawImage
				(
					this.imgPar[0],
					p.x,p.y,
					this.imgPar[0].width * p.size.value,
					this.imgPar[0].height* p.size.value,
					p.gAnchor
				);
			}
				
			graphics.setAlpha( 1 );
		}

		if(callback)callback();

	};

	function rand(min,max)
	{
		var ret = Math.ceil( Math.random()*((max+1) - min ) - 1 ) + min;
		return ret;
	}

	return cxFloats;
});


