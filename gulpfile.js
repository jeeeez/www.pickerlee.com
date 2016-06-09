var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('sass', function() {
	var sass = require('gulp-sass');
	return gulp.src('./src/**/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass({
			// outputStyle: 'compressed'
		}).on('error', sass.logError))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./build'));
});

gulp.task('sass:watch', function() {
	gulp.watch('./src/**/*.scss', ['sass']);
});

gulp.task('css', ['sass'], function() {
	var postcss = require('gulp-postcss');

	return gulp.src('./build/**/*.css')
		.pipe(sourcemaps.init())
		.pipe(postcss([require('autoprefixer')({
			browsers: ['last 2 versions']
		}), require('postcss-sorting')({
			"sort-order": ["margin", "padding"]
		}), require('precss')]))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('./build/'));
});

gulp.task('default', ['css', 'sass:watch']);
