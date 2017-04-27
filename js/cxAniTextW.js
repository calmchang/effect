

;(function (root, factory) {
var name = "nnEsAniTextW";
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
		function CAniWText( id ){
			this.domTitle = document.getElementById(id);
			this.time = 6000;
		}


		CAniWText.prototype.setTitle = function(title){
			var chars = title.split("");
		  this.domTitle.innerHTML = '<span>' + chars.join('</span><span>') + '</span>';
		};


		CAniWText.prototype.play = function(textList, type, callback){
			var self = this;
			this.textList = textList;
			this.idx = 0;


			var next = function(){
				if( self.idx >= self.textList.length ){
					callback();
					return;
				}
				self.setTitle( textList[self.idx++] );
				setTimeout(function(){
					next();
				}, self.time);
				

			};

			next();

		};

		return CAniWText;

});



