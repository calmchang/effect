
;(function (root, factory) {
var name = "Particle";
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

	var Graphics = nnCG.Graphics;

	function Particle()
	{
		ext(this, nnCG.nnCGObject, []);

		//当前各方向上速度
		this.vX=0;
		this.vY=0;
		//各方向上的重力场
		this.gX=0;
		this.gY=9.8;
		//自身旋转速度
		this.vRota=0;
		//消失速度
		this.vDestory=0;
		//初始大小
		this.size = 1;
		//变化大小
		this.sizeChange  = 0;
		//当前的透明度
		this.alpha = 255;
		//锚点
		this.gAnchor = null;
		this.callback = null;
		
	}
	
	/*
	 * x,y:出生点位置
	 * vx,vy:方向上的速度
	 * gx,gy:方向上的重力
	 * vDestory:消失速度
	 */
	Particle.prototype.shoot = function(x,y,vx,vy,gx,gy,vDestory,size,sizeChange,gAnchor,callback)
	{
		this.location.x = x ;
		this.location.y = y ;
		this.type = 'image';
		
		this.vX = vx ;
		this.vY = vy ;
		
		this.gX = gx ;
		this.gY = gy ;
		this.size = {
			width:-1,height:-1,
			scaleW:size,scaleH:size,
		};
		
		if( typeof(gAnchor) != 'undefined' )
		{
			this.anchor = gAnchor;
		}
		
		this.sizeChange = 0;
		
		if( typeof(sizeChange) != 'undefined' )
		{
			this.sizeChange = sizeChange;
		}
		
		this.vDestory=vDestory;
		
		this.callback = callback;
		
	};

	Particle.prototype.destory = function()
	{
		if( this.callback != null )
		{
			this.callback(this);
		}
	};

	Particle.prototype.run = function()
	{
		this.location.x += (this.gX + this.vX);
		this.location.y += (this.gY + this.vY);
		
		this.alpha -= (this.vDestory);
		this.alpha = this.alpha < 0 ? 0 : this.alpha;
		
		this.size.scalW += this.sizeChange;
		this.size.scalH += this.sizeChange;
		if( this.alpha <= 0 )
		{
			return false;
		}
		return true;
	};
	


	function cxParticle(option)
	{

		this.pRoot = null;
		this.pLastSpeed = 1;

		this.canvasID = option.canvasID;
		this.imgSrc = option.imgSrc;
		
		this.gGraphics = null;
		this.runcount = 0;
		
		this.imgPar = [];
		this.pList = [];
		this.canvasTimer1 = null;


	}
	

	cxParticle.prototype.loaded = function(callback)
	{

		var img = new Image();
		var self = this;
		img.onload = function(e)
		{
			//img = self.getGraphics().changeColorImage(img , 243, 234, 91, 0);
			self.imgPar.push(img);



			if( !callback ){
				self.start();
				return;
			}
			if(callback)callback();
		};
		
		img.src= self.imgSrc;
	};
	
	
	
	cxParticle.prototype.getGraphics = function()
	{
		if( this.gGraphics === null )
		{
			this.gGraphics = new Graphics( document.getElementById( this.canvasID ) );
		}

		return this.gGraphics;
	};
	
	cxParticle.prototype.startWithPRoot = function(bornX,bornY){

		var self = this;

		var runNext= function(){
			if( self.pRoot.length <= 0  )return;

				var screenScaleX =  (window.innerWidth / 375 );
				var screenScaleY = (window.innerHeight / 100 );

				var data = self.pRoot[0];
				var p = new Particle();
				var cx = bornX  + data[0] * screenScaleX;
				var cy = bornY  + data[1] * screenScaleY;
				var vx = 0;
				var vy = 0;
				var live = 1;
				var size = 0.5;
				var gx=3-rand(0,6);
				var gy=3-rand(0,6);
				var sizeChange = -rand(1,5)/100;
				
						//(x,y,vx,vy,gx,gy,vDestory,size,sizeChange,gAnchor,callback)
				p.shoot( cx , cy , vx , vy , gx , gy  , live ,size,sizeChange);

				
				self.pList.push(p);

				if( data[2] != 0 ){
					if( data[2] > 0 )
					{
						self.pLastSpeed = data[2] + 1;
					}
					else if( data[2] < 0 ){
						self.pLastSpeed = 1;
					}
				}
				for( var i = 0 ; i < self.pLastSpeed ; i++ ){
					self.pRoot.shift();
				}
		};

		self.canvasTimer1 = setInterval(function()
		{
			self.run(runNext);
		},24);


	};

	cxParticle.prototype.start = function(count)
	{	
		var self = this;
		for( var i = 0 ; i < count ; i++ )
		{
			self.randShoot();
		}
		
		self.canvasTimer1 = setInterval(function()
		{
			self.run();
		},24);
		
	};

	cxParticle.prototype.stop = function()
	{
		window.clearInterval( this.canvasTimer1 );
	};


	cxParticle.prototype.randShoot = function()
	{
		var p = new Particle();
		var cx = rand(-20,700);
		var cy = rand(-40,-100);
		var vx = rand(-4,4);
		var vy = rand(0,1);
		var live = rand(0.5,2);
		var size = rand(0.1,0.2);
				//(x,y,vx,vy,gx,gy,vDestory,size,sizeChange,gAnchor,callback)
		p.shoot( cx , cy , vx , vy ,0.05+1, 0.1+1 , live ,size);

		p.image = this.imgPar[0];
		
		this.pList.push(p);
	};

	cxParticle.prototype.run = function(callback)
	{
		var graphics = this.getGraphics();
		graphics.blendmode = Graphics.BlendMode.Transparent;
		
		//graphics.clear('transparent');
		graphics.fillRect(0,0,graphics.width,graphics.height,"rgba(0,0,0,0.5)");

		graphics.blendmode = Graphics.BlendMode.Normal;

		this.runcount++;


		
		for( var i = 0 ; i < this.pList.length ; i++ )
		{
			var p = this.pList[i];
			if( p === null || p.run() === false )
			{
				p.destory();
				this.pList.splice(i,1);
				i--;
				
				continue;
			}
			p.draw(graphics);

				// graphics.setAlpha(  1*p.alpha/255 );

				// graphics.drawImage
				// (
				// 	this.imgPar[0],
				// 	p.x,p.y,
				// 	this.imgPar[0].width * p.size,
				// 	this.imgPar[0].height* p.size,
				// 	p.gAnchor
				// );
				// graphics.setAlpha( 1 );
			
		}

		if(callback)callback();

	};

	function rand(min,max)
	{
		var ret = Math.ceil( Math.random()*((max+1) - min ) - 1 ) + min;
		return ret;
	}

	return cxParticle;
});


