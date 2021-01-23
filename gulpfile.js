const gulp = require('gulp'),
    sass = require('gulp-sass'),
    babelify = require('babelify'),
    browserify = require('browserify'),
    connect = require('gulp-connect'),
    source = require('vinyl-source-stream'),
    autoprefixer = require('gulp-autoprefixer'),
    buffer = require('vinyl-buffer'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps')

const BROWSER_SYNC_PORT = 8888

gulp.task('scss', function() {
    return gulp
        .src('./src/scss/**/*.scss')

        .pipe(
            autoprefixer({
                overrideBrowserslist: [
                    // https://github.com/ai/browserslist#queries
                    'last 2 version',
                    '> 2%',
                ],
            }),
        )
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(gulp.dest('./src/css'))
})

gulp.task('js', function() {
    return browserify({
        entries: ['./src/js/index.js'],
    })
        .transform(
            babelify.configure({
                presets: ['es2015'],
            }),
        )
        .bundle()
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('./src/public/js'))
})

gulp.task('startServer', function() {
    connect.server({
        root: './src',
        livereload: true,
        port: BROWSER_SYNC_PORT,
    })
})

gulp.task('default', gulp.series('scss', 'js', 'startServer'))
// watch sass files
gulp.watch('./src/scss/**/*.scss', gulp.series('scss'))
// watch js
gulp.watch('./src/js/**/*.js', gulp.series('js'))
