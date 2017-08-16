
var dropInfo={
	dom:null,
	id:"text",
	isDown:false,
	x:0,
	y:0,
	left:0,
	top:0,
	text:"仅限XX使用",
};
var imgInfo={
	img:null,
};

var maxWidth=1024;

window.onload=function(){
	dropInfo.dom=document.getElementById(dropInfo.id);
	dropInfo.left = dropInfo.dom.offsetLeft;
	dropInfo.top = dropInfo.dom.offsetTop;
};



document.addEventListener('mousemove', function(e){

	if(dropInfo.isDown === true ){
		var x = e.x-dropInfo.x;
		var y = e.y-dropInfo.y;
		dropInfo.dom.style.left = dropInfo.left + x + 'px';
		dropInfo.dom.style.top = dropInfo.top + y + 'px';
	}
}, false);
document.addEventListener('mouseup', function(e){
	dropInfo.isDown =false;
}, false);
document.addEventListener('mousedown', function(e){
	console.log(e.target.id);
	if(e.target.id === dropInfo.id ){
		dropInfo.isDown = true;
		dropInfo.x = e.x;
		dropInfo.y = e.y;
		dropInfo.left = dropInfo.dom.offsetLeft;
		dropInfo.top = dropInfo.dom.offsetTop;
	}
}, false);

document.addEventListener('touchend', function(e){
	dropInfo.isDown =false;
}, false);
document.addEventListener('touchmove', function(e){

	if(dropInfo.isDown === true ){
		var x = e.touches[0].screenX-dropInfo.x;
		var y = e.touches[0].screenY-dropInfo.y;
		dropInfo.dom.style.left = dropInfo.left + x + 'px';
		dropInfo.dom.style.top = dropInfo.top + y + 'px';
	}
}, false);
document.addEventListener('touchstart', function(e){
	if(e.target.id === dropInfo.id ){
		dropInfo.isDown = true;
		dropInfo.x = e.touches[0].screenX;
		dropInfo.y = e.touches[0].screenY;
		dropInfo.left = dropInfo.dom.offsetLeft;
		dropInfo.top = dropInfo.dom.offsetTop;
	}
}, false);


document.getElementById('inputFlag').onkeyup=function(e){
	dropInfo.text = document.getElementById('text').innerText=e.target.value;
};
document.getElementById('inputFlag').onchange=function(e){
	dropInfo.text = document.getElementById('text').innerText=e.target.value;
};



document.getElementById('btnOk').onclick=function(){

	var img = imgInfo.img;

	var left = dropInfo.dom.offsetLeft;
	var top = dropInfo.dom.offsetTop;
	var domView = document.getElementById('imgCanvas');

	var bili={
		x:left/domView.clientWidth,
		y:top/domView.clientHeight,
		fontX:14/domView.clientWidth,
		fontY:14/domView.clientHeight,
	};

	var width=img.width;
	var height=img.height;
	if(img.width>maxWidth){
		width = maxWidth;
		height=height * maxWidth/img.width;
	}

	var canvas = document.getElementById('canvas');
	canvas.width = width;
	canvas.height= height;
	var graphics = new window.nnCG.Graphics(canvas);
	graphics.drawImage(img,0,0,width,height);

	var fontX = bili.fontX*width;
	var fontY = bili.fontY*height;
	var font = fontX > fontY ? fontY:fontX;
	font = +font;
	console.log("比例：" + bili.x+','+bili.y+','+font);
	console.log("目标：" + bili.x*width+','+bili.y*height);
	
	graphics.drawText(dropInfo.text,bili.x*width,bili.y*height,{
		//stroke:true,
		shadow:{color:"#000000"},
		color:"#f3e764",
		font:font+"px Georgia",
	});

	document.getElementById('imgOutput').src=graphics.getImage();

	document.getElementById('tip').style.display="block";
	document.getElementById('viewCanvas').style.display="block";
	document.getElementById('btnReset').style.display="block";



};


document.getElementById('btnReset').onclick=function(){
	location.reload();
};

document.getElementById('btnOpen').onclick=function(){

	getFile('getImage',function(img){
		document.getElementById('btnOk').disabled = false;
		document.getElementById('inputFlag').style.display = "block";
		
		document.getElementById('tip2').style.display = "block";
		
		imgInfo.img = img;
		document.getElementById('imgResult').src = img.src;
	});
	
};

function getFile(id, callback){
	var inputFile =document.getElementById(id);
	inputFile.onchange = function(e){
		try{
			var imgFile = e.currentTarget.files[0];
			var fr = new FileReader();
			fr.onloadend = function(e)
			{
				var temp = e.target.result;
				var tempImage = document.createElement('img');
				tempImage.onload=function(e){
					callback(e.target);
				};
				tempImage.src=temp;
			};
			fr.readAsDataURL(imgFile);  //readAsDataURL
		}catch(ex){

		}
	};
	inputFile.click();
}