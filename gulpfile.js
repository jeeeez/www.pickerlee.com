var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var clean = require('gulp-clean');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');

gulp.task('clean', function() {
	return gulp.src('./build/assets/styles').pipe(clean());
});

gulp.task('sass:watch', function() {
	gulp.watch('./assets/**/*.scss', ['css']);
});

gulp.task('css', ['clean'], function() {
	return gulp.src('./assets/**/*.scss')
		.pipe(sourcemaps.init({
			loadMaps: true
		}))
		.pipe(sass())
		.on('error', sass.logError)
		.pipe(postcss([require('autoprefixer')({
			browsers: ['last 2 versions']
		}), require('postcss-sorting')(), require('precss')]))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('./build/assets/'));
});

gulp.task('default', ['css', 'sass:watch']);
