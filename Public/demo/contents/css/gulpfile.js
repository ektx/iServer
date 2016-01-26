var gulp = require('gulp'),
    jshint = require("gulp-jshint"),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require("gulp-uglify"),
    rename = require('gulp-rename'),
    minifyCss = require("gulp-minify-css"),
    concat = require("gulp-concat"),
    livereload = require('gulp-livereload'),
    minifyHtml = require("gulp-minify-html");
// 语法检查
gulp.task('jshint', function () {
return gulp.src(['scripts/mods/common.js','scripts/mods/waker.js'])
.pipe(jshint())
.pipe(jshint.reporter('default'));
});
// 压缩JS
gulp.task('minify-js', function() {
    gulp.src(['scripts/mods/common.js','scripts/mods/waker.js']) // 要压缩的js文件
        // .pipe(concat('work.js')) // 合并匹配到的js文件并命名为 "work.js"
        .pipe(uglify()) //使用uglify进行压缩,更多配置请参考：
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('scripts/mods')); //压缩后的路径
});
// 压缩css
gulp.task('minify-css', function() {
    gulp.src(['css/*.css','!css/*.min.css']) // 要压缩的css文件
        .pipe(sourcemaps.init())
        .pipe(minifyCss()) //压缩css
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(sourcemaps.write('.', {
            includeContent: false
        }))
        .pipe(gulp.dest('css'));
});
// 监控执行
gulp.task('watch', function() {
  // livereload.listen(); //要在这里调用listen()方法
  gulp.watch(['scripts/mods/common.js','scripts/mods/waker.js'], ['minify-js']);
  gulp.watch(['css/*.css','!css/*.min.css'], ['minify-css']);
});
// 执行
gulp.task('default', function() {
    gulp.start('jshint','minify-js','minify-css','watch');//
});


