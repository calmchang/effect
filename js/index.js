
var util = new UTIL();

function UTIL(){
}

UTIL.prototype.getDom= function(id){
	return document.getElementById(id);
};

UTIL.prototype.hideDom= function(dom) {
    if (dom && typeof dom === 'string') {
        dom = this.getDom(dom);
    }
    dom.classList.add('flex-hide');
};

UTIL.prototype.showDom= function(dom) {
    if (dom && typeof dom === 'string') {
        dom = this.getDom(dom);
    }
    dom.classList.remove('flex-hide');
};

UTIL.prototype.rand= function(min,max)
	{
		var ret = Math.ceil( Math.random()*((max+1) - min ) - 1 ) + min;
		return ret;
	};



window.onload= function(){
	util.getDom('cg-list').onclick= function(e){
		var id= e.target.id;

		if( id=== 'cg1' ){
			new CG1().go();
		}
		else if( id=== 'cg2' ){
			new CG2().go();
		}
		else if( id=== 'cg3' ){
			new CG3().go();
		}
		console.log('click '+id);
	};
};


function CG1(){
	this.halo = new nnCG.Halo({canvasID:'canvasCG1'});
	this.graphics = this.halo.graphics;
	
}

CG1.prototype.go = function(){
	var self= this;
	util.showDom('cg1Body');

	this.halo.start(30);
};



function CG2(){
	this.particle = new nnCG.Particle({canvasID:'canvasCG2',imgSrc:'image/p1.png'});

	this.graphics = this.particle.graphics;
	
}

CG2.prototype.go = function(){
	var self= this;
	util.showDom('cg2Body');
	this.particle.loaded(function(){
		self.particle.start(30);
	});
	
};



function CG3(){	
	var Graphics = nnCG.Graphics;
	var self=this;

	var img = new Image();
	
	img.onload = function(){
		self.gGraphics = new Graphics( document.getElementById( 'canvasCG3' ) );
		self.gGraphics.drawImage(img,0,0,img.width,img.height);
	};
	img.src='image/btnOk.png';
	
}

CG3.prototype.go = function(){
	var self= this;
	util.showDom('cg3Body');

	
};
