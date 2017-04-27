/**
 * 光斑效果
 */
;
(function(root, factory) {
    var name = "Halo";
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
        if (typeof root.nnCG === 'undefined') {
            root.nnCG = {};
        }
        root.nnCG[name] = factory();
    }
})(this || window, function() {

    var Graphics = nnCG.Graphics;

    function Halo(options, nnCGProgressValue) {

        ext(this, nnCG.nnCGObject, [{
        	type:'circular',
        	x: options.x,
        	y: options.y,
        	width:options.width||1,
        	height:options.height||1,
        	scaleW:options.size||1,
        	scaleH:options.size||1,
        	color:options.color || "rgba(0,0,0,1)",
        	fillStyle:options.color || "rgba(0,0,0,1)",
        	alpha:options.from || 0 
        }]);

        this.delay = {
            born: options.delay.born || 0, //出生延迟
            dead: options.delay.dead || 0 //死亡后延迟
        };

        var progress = nnCGProgressValue || nnCG.ProgressValue;
        this.progress = new progress({
            from: options.from || 0,
            to: options.to || 255,
            time: options.time || 1000, //生命周期	(时间ms)
            tween: nnCG.Tween.Linear
        });
    }

    Halo.prototype.destory = function() {
    	this.progress.destory();
    	this.progress = null;
    	this.delay = null;
    	this._destory();
    };


    Halo.prototype.run = function(ms) {
        if (this.delay.born > 0) {
            this.delay.born -= ms;
        } else {
            if (this.progress.run(ms) === false) {
                if (this.delay.dead > 0) {
                    this.delay.dead -= ms;
                } else {
                    return false;
                }
            }
        }
        this.alpha = this.progress.value;
        return true;
    };


    function cxHalo(options) {
        this.child = [];

        this.canvasID = options.canvasID;
        this.graphics = this.getGraphics();
        this.pause = false;
    }

    cxHalo.prototype.getGraphics = function() {
        if (!this.graphics) {
            this.graphics = new Graphics(document.getElementById(this.canvasID));
        }

        return this.graphics;
    };


    cxHalo.prototype.start = function(count) {
        var self = this;
        count = count || 10;

        for (var i = 0; i < count; i++) {
            self.randShoot();
        }

        self.canvasTimer1 = setInterval(function() {
            self.run(16);
        }, 16);

    };

    cxHalo.prototype.pause = function() {
        this.pause = true;
    };
    cxHalo.prototype.resume = function() {
        this.pause = false;
    };


    cxHalo.prototype.randShoot = function() {
        var maxR = 8;
        var maxR2 = maxR + maxR;

        var options = {
            x: rand(maxR + maxR, this.graphics.width - maxR2 - maxR2),
            y: rand(maxR + maxR, this.graphics.height - maxR2 - maxR2),
            size: rand(3, maxR), //大小
            width:1,
            height:1,
            delay: {
                born: rand(1, 10) * 500,
                dead: rand(1, 10) * 500
            },
            //color:
            from: 0,
            to: rand(150, 255),
            time: rand(3, 10) * 500,
            color: this.graphics.getHSLA(11, rand(58, 100), rand(80, 100)),
        };

        var p = new Halo(options);
        this.child.push(p);
    };

    cxHalo.prototype.run = function(ms) {
        if (this.pause === true) return;

        var graphics = this.getGraphics();

        graphics.blendmode = Graphics.BlendMode.Transparent;

        //graphics.clear('transparent');
        graphics.fillRect(0, 0, graphics.width, graphics.height, "rgba(0,0,0,0.5)");

        graphics.blendmode = Graphics.BlendMode.Normal;

        for (var i = 0; i < this.child.length; i++) {
            var p = this.child[i];
            if (p === null || p.run(ms) === false) {
            		p.destory();
            		this.child.splice(i, 1);
                
                this.randShoot();
                i--;
                continue;
            }
            p.draw(graphics);
        }


    };

    function rand(min, max) {
        var ret = Math.ceil(Math.random() * ((max + 1) - min) - 1) + min;
        return ret;
    }

    return cxHalo;
});
