	
;(function (root, factory) {
var name = "Graphics";
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


	Graphics.BlendMode = {};
	Graphics.BlendMode.LIGHT='lighter';
	Graphics.BlendMode.Transparent = 'destination-out';
	Graphics.BlendMode.Normal = 'source-over';

	Graphics.VCENTRE = (1<<0);
	Graphics.HCENTRE = (1<<1);
	
	function Graphics(canvasDiv)
	{
		this.div = canvasDiv;
		this.g = this.div.getContext("2d");
		this.width = this.div.width;
		this.height = this.div.height;
		this.blendmode=Graphics.BlendMode.Normal;
		
	}

	Graphics.prototype.hslToRgb= function(h, s, l){
    var r, g, b;

    if(s === 0){
        r = g = b = l; // achromatic
    }else{
        var hue2rgb = function(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
	};

	Graphics.prototype.rgbToHsl= function(r, g, b){
    r /= 255;
    g /= 255;
    b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max === min){
        h = s = 0; // achromatic
    }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, l];
	};

	/**
	 * r,g,b:0~255
	 * a:0~255
	 * return "rgba(222,5,33,0.5)"
	 */
	Graphics.prototype.getRGBA = function(r,g,b,a){
		a = a || 255;
		var temp = 'rgba(R,G,B,A)';
		temp = temp.replace('R',r);
		temp = temp.replace('G',g);
		temp = temp.replace('B',b);
		temp = temp.replace('A', +(a/255).toFixed(1) );

		return temp;
	};


	/**
	 * h:0~360
	 * s:0%~100%
	 * l:0%~100%
	 * a:0~255
	 * return "hsla(22,5%,65%,0.5)"
	 */
	Graphics.prototype.getHSLA = function(h,s,l,a){
		a = a || 255;
		var temp = 'hsla(H,S%,L%,A)';
		temp = temp.replace('H',h);
		temp = temp.replace('S',s);
		temp = temp.replace('L',l);
		temp = temp.replace('A', +(a/255).toFixed(1) );
		return temp;
	};



	Graphics.prototype.setAlpha = function(alpha) 
	{
		this.g.globalAlpha = alpha;
		this.g.globalAlpha = this.g.globalAlpha < 0 ? 0 : this.g.globalAlpha;
	};
	
	Graphics.prototype.scale = function(scaleX,scaleY) 
	{
		this.g.scale(scaleX,scaleY);
	};
	
	Graphics.prototype.clear = function(color) 
	{
		
		// graphics.blendmode = Graphics.BlendMode.Transparent;
		// graphics.fillRect(0,0,graphics.width,graphics.height,"rgba(0,0,0,0.5)");
		// graphics.blendmode = Graphics.BlendMode.Normal;


		if( color == 'transparent')
		{
			this.g.clearRect(0,0,this.width,this.height);
			return;
		}
		
		//if( this.blendmode != null )this.g.globalCompositeOperation = this.blendmode;
		
		this.g.globalCompositeOperation = 'source-over';
		this.g.clearRect(0,0,this.width,this.height);
		this.g.fillStyle=color;
		this.g.fillRect(0,0,this.width,this.height);
		this.g.fill();
	};
	
	Graphics.prototype.drawPixel = function(sx,sy,color,w,h) 
	{
		if( this.blendmode !== null )this.g.globalCompositeOperation = this.blendmode;

		this.g.fillStyle = color;
		if( !w === true ){w = 1;}
		if( !h === true ){h = 1;}
		this.g.fillRect(sx, sy, w, h);
		this.g.fill();

		this.g.globalCompositeOperation = 'source-over';
		
	};

	Graphics.prototype.fillRect = function(sx,sy,w,h,color) 
	{
		if( this.blendmode !== null )this.g.globalCompositeOperation = this.blendmode;
		
		this.g.fillStyle = color;
		this.g.beginPath();
		this.g.fillRect(sx,sy,w,h);
		this.g.fill();

		this.g.globalCompositeOperation = 'source-over';
	};


	Graphics.prototype.fillArc = function(sx,sy,r,color) 
	{
		if( this.blendmode !== null )this.g.globalCompositeOperation = this.blendmode;

		this.g.fillStyle = color;
		this.g.beginPath();
		this.g.arc(sx,sy,r,0,Math.PI * 2, false);
		this.g.fill();

		this.g.globalCompositeOperation = 'source-over';
	};

	Graphics.prototype.drawLine = function(sx,sy,dx,dy,color) 
	{
		if( this.blendmode !== null )this.g.globalCompositeOperation = this.blendmode;

		this.g.beginPath();
		this.g.moveTo(sx,sy);
		this.g.lineTo(dx,dy);
		this.g.strokeStyle = color;
		this.g.stroke();

		this.g.globalCompositeOperation = 'source-over';
	};

	Graphics.prototype.drawImage = function(img,dx,dy,w,h,gAnchor){
		if( this.blendmode !== null )this.g.globalCompositeOperation = this.blendmode;
		
		if( typeof(gAnchor) !== 'undefined' && gAnchor !== null )
		{
			if( (gAnchor & Graphics.VCENTRE) !== 0 )
			{
				dy -= (h/2);
			}
			if( (gAnchor & Graphics.HCENTRE) !== 0 )
			{
				dx -= (w/2);
			}
		}
		this.g.drawImage(img,dx,dy,w,h);
		
		this.g.globalCompositeOperation = 'source-over';
	};


	Graphics.prototype.changeColorImage = function(img, red,green,blue,alpha) {
		var canvas = document.createElement('canvas');
		canvas.width = img.width;
		canvas.height = img.height;
		var ctx = canvas.getContext('2d');
		ctx.clearRect(0,0,canvas.width,canvas.height);

		ctx.drawImage(img,0,0);
		var imgData = ctx.getImageData(0,0,img.width,img.height);

		for ( var i = 0; i < imgData.data.length; i += 4 )
	  {
		  imgData.data[i] 	= red ;
		  imgData.data[i+1] = green;
		  imgData.data[i+2] = blue;
		  imgData.data[i+3] = imgData.data[i+3];
	  }

	  ctx.clearRect(0,0,canvas.width,canvas.height);

	  ctx.putImageData(imgData,0,0);

	  var ret = new Image();
	  ret.src = canvas.toDataURL("image/png");
	  return ret;

	};

	return Graphics;
});


