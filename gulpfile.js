var gulp = require("gulp");
var sass = require("gulp-sass"); //编译scss
var uglify = require("gulp-uglify"); //压缩js
var server = require("gulp-webserver"); //起服
var babel = require("gulp-babel") //es5-es6
var clean = require("gulp-clean-css")
var autoprefixer = require("gulp-autoprefixer")
var fs = require("fs");
var path = require("path");
var url = require("url")


//在gulp中创建scss任务，进行scss文件编译，并且压缩css
gulp.task('sass', function() {
    return gulp.src(['./src/scss/*.scss', '!./src/scss/_mixin.scss', '!./src/scss/common.scss'])
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: 'List 2 versions'
        }))
        .pipe(clean())
        .pipe(gulp.dest('./src/css/'))
})

//在gulp中使用webserver启动web服务，并且提供自动刷新功能
gulp.task('server', function() {
    return gulp.src('./src')
        .pipe(server({
            port: 8080,
            livereload: true,
            directoryListing: true,
            open: true,
            middleware: function(req, res, next) {
                var pathname = url.parse(req.url).pathname;
                console.log(pathname);
                if (pathname == "/favicon.ico") {
                    return res.end()
                }
                pathname = pathname == '/' ? 'index.html' : pathname
                var filename = path.extname(pathname)
                if (filename) {
                    var filepath = path.join(__dirname, 'src', pathname)
                    res.end(fs.readFileSync(filepath))
                }
            }
        }));
})

//在gulp中创建js任务编译js文件，合并js，并且压缩
gulp.task('uglify', function() {
    return gulp.src(['./src/js/*.js', '!./src/js/flexible.js'])
        .pipe(babel({
            presets: "es2015"
        }))
        .pipe(uglify())
        .pipe(gulp.dest('./build/js/'))
})

//在gulp中创建build任务，指向js,css任务，并把文件生成到dist文件夹
gulp.task('copycss', function() {
    return gulp.src('./src/css/*.css')
        .pipe(gulp.dest('./bulid/css'))
})

//在gulp中创建watch任务，进行css文件监听，自动执行对应的任务
gulp.task("watch", function() {
    return gulp.watch('./src/scss/*.scss', gulp.series("sass"))
})

//在gulp中创建default任务，默认执行webserver服务，js，css，watch任务
gulp.task("build", gulp.parallel("uglify", "copycss"))
gulp.task("dev", gulp.series("sass", "server", "watch"))