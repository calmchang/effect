;
(function(root, factory) {
    var name = "nnCGObject";

    /**
     * 继承
     * @param  {[type]} son    [this]
     * @param  {[type]} father [需要继承的父类]
     * @param  {[type]} arg    [arguments]
     * @return {[type]}        [description]
     */
    root.ext = function(son, father, arg) {

        father.apply(son, arguments[2]);
        for (var param in father.prototype) {
            if (!son.__proto__[param]) {
                son.__proto__[param] = father.prototype[param];
            }
        }
    };

    if (typeof exports === 'object' && typeof module === 'object') {
        console.log(name + "init by module.exports");
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        console.log(name + "init by define");
        define([], factory);
    } else if (typeof exports === 'object') {
        console.log(name + "init by exports." + name);
        exports[name] = factory();
    } else {
        console.log(name + "init by window.nnCG." + name);
        if (typeof root.nnUtil === 'undefined') {
            root.nnCG = {};
        }
        root.nnCG[name] = factory();
    }
})(this || window, function() {

    function CGObject(options) {

        // this._type = '';
        // this._fillStyle = '';
        // this._image = null;
        // this._size = null;
        // this._alpha = null;
        // this._color = null;
        // this._location = null;
        // this._anchor = null;

        // this.type = {
        //     get: function() {
        //         return this._type; },
        //     set: function(value) { this._type = value; }
        // };

        // this.fillStyle = {
        //     get: function() {
        //         return this._fillStyle; },
        //     set: function(value) { this._fillStyle = value; },
        // };
        // this.image = {
        //     get: function() {
        //         return this._image; },
        //     set: function(value) { this._image = value; },
        // };
        // this.color = {
        //     get: function() {
        //         return this._color; },
        //     set: function(value) { this._color = value; },
        // };
        // this.size = {
        //     get: function() {
        //         return this._size; },
        //     set: function(value) { this._size = value; },
        // };
        // this.alpha = {
        //     get: function() {
        //         return this._alpha; },
        //     set: function(value) { this._alpha = value; },
        // };
        // this.location = {
        //     get: function() {
        //         return this._location; },
        //     set: function(value) { this._location = value; },
        // };
        // this.anchor = {
        //     get: function() {
        //         return this._anchor; },
        //     set: function(value) { this._anchor = value; },
        // };

				this.type = (options && options.type) || ""; //circular:圆形, image:图片, pixel:像素点 , rect:矩形
				this.fillStyle = (options && options.fillStyle) || "rgba(0,0,0,1)";
				this.image = (options && options.image) || null;
				this.color = (options && options.color) || '';
				this.size = {
					scaleW:(options && options.scaleW)||1,
					scaleH:(options && options.scaleH)||1,
					width: (options && options.width) || -1,
					height: (options && options.height) || -1
				};
				this.alpha = (options && options.alpha) || 255;//0~255
				this.location = {
					x: (options && options.x) || 0,
					y: (options && options.y) || 0
				};
				this.anchor = (options && options.anchor) || '';

    }




    CGObject.prototype._destory = function() {
        this.size = null;
        this.image = null;
        this.color = null;
        this.location = null;
    };

    CGObject.prototype.draw = function(graphics) {

        graphics.setAlpha(1 * this.alpha / 255);

        if (this.type === 'image') {
        	var w,h;
        	w= this.size.width;
        	h= this.size.height;
        	if( this.size.width === -1 ){
        		w = this.image.width;
        		h = this.image.height;
        	}
            graphics.drawImage(
                this.image,
                this.location.x, this.location.y,
                w * this.size.scaleW,
                h * this.size.scaleH,
                this.anchor
            );
        } else if (this.type === 'circular') {
            graphics.fillArc(
                this.location.x,
                this.location.y,
                this.size.width * this.size.scaleW,
                this.fillStyle
            );
        } else if (this.type === 'rect') {
            graphics.fillRect(
                this.location.x,
                this.location.y,
                this.size.width * this.size.scaleW,
                this.size.height * this.size.scaleH,
                this.fillStyle
            );
        }

        graphics.setAlpha(1);
    };



    return CGObject;

});
