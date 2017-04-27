var gulp = require('gulp'),
gulpSequence = require('gulp-sequence'),//GULP执行顺序
notify = require("gulp-notify"),//用于输出日志
gutil = require("gulp-util"),
minimist = require('minimist'),//获取管道符
mergeStream = require("merge-stream");//多个任务全部执行完再返回

var clean = require('gulp-clean');

var browserSync = require('browser-sync').create();
var reload = browserSync.reload;


/**
 * 打包相关的参数
 */
var packageOptions = {
	isRelease: false,//是否生产版本
	isLog:false,//是否打印日志

	template_data_list :{ //模板内用到的变量
		version:'150',//版本号
		server_host:'http://192.168.3.193:19000',//'https://m.sit.nonobank.com',

	}
};


/**
 * 用来检查是否带--env参数，--env参数用来标识打包的版本类型
 * @type {Object}
 */
var knownOptions = {
	string:'env',
	default:{env:process.env.NODE_ENV || 'dev'}
};


var options = minimist(process.argv.slice(2),knownOptions);


if( options.env == 'production' ){
	packageOptions.isRelease = true;
	packageOptions.isLog = true;
}


function log(msg,color){
	gutil.log(gutil.colors[color](msg));
}


var errorReport = function(error){
	var args = Array.prototype.slice.call(arguments);
	log(error,'red');
	//notify.onError("error: " + error.relativePath).apply(this, args);//替换为当前对象
	this.emit();
};




gulp.task('clean', function() {		
	var task1 = gulp.src(['tmp','dist','tmp_rjs']).pipe(clean());
	return mergeStream(task1);
});



var sass = require('gulp-sass'),//编译SCSS
autoprefixer = require('gulp-autoprefixer');

gulp.task('sass', function() {
	var mode = 'compressed';
	if( packageOptions.isRelease === false ){
		mode = 'nested';
	}
  return gulp.src('css/*.scss')
		.pipe( sass({outputStyle:mode}) ).on('error', errorReport)
		.pipe( autoprefixer({
						browsers:['last 9 versions',"> 5%"],
						cascade:true,
						remove:true,
					})).on('error', errorReport)
    .pipe(gulp.dest('css'));
});



gulp.task('dev', ['sass'], function(){

	var ret = browserSync.init({
  			browser: "google chrome",
        server: {
        }
    });

	gulp.watch([ 'css/*.scss'],function(event){
		gulpSequence('sass')(function(err){
			if(err)console.log(err);
		});
	});
});






