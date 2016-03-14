const _PROJECTNAME = '';

var gulp = require('gulp'),
	concat = require('gulp-concat-css'),
	jshint = require('gulp-jshint'),
	minifycss = require('gulp-minify-css'),
	rename = require('gulp-rename'),
	uglify = require('gulp-uglify'),
	imageResize = require('gulp-image-resize'),
	tinypng = require('gulp-tinypng'),
	browserSync = require('browser-sync').create();

/*
 * To use the gulp-image-resize, it needs of some dependencies:
 * https://www.npmjs.com/package/gulp-image-resize
 *
 * Or, install:
 *
 * Ubuntu:
 * apt-get install imagemagick
 * apt-get install graphicsmagick
 *
 * Mac:
 * brew install imagemagick
 * brew install graphicsmagick
 *
 * Windows & others:
 * http://www.imagemagick.org/script/binary-releases.php
 * */

var tinypngToken = 'hHrU0V0DGG3tNna6R1sqNNOqqU-x1S4u';

// Content structure

var source = {
	content: '*',
	location: './'
};

source.css = {
	content: '*.css',
	location: 'css/'
};

source.js = {
	content: '*.js',
	location: 'js/'
};

source.index = {
	content: '*.html',
	location: './'
};

source.images = {
	content: '*.*',
	location: 'img/'
};

source.images.largePhotos = {
	content: '*.*',
	location: source.images.location + 'largePhotos/'
};

var dist = {
	content: '*',
	location: 'dist/'
};

dist.css = source.css;
dist.css.location = dist.location + dist.css.location;

dist.js = source.js;
dist.js.location = dist.location + dist.js.location;

// CSS

gulp.task('css', function() {
	gulp.src(css.location + css.content)
		.pipe(concat(_PROJECTNAME + '.css'))
		.pipe(gulp.dest(dist.css.location))
		.pipe(minifycss())
		.pipe(rename({
			extname: '.min.css'
		}))
		.pipe(gulp.dest(dist.css.location));
});

// JS

gulp.task('js', function() {
	gulp.src(jsfiles)
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
		.pipe(gulp.dest(dist.js.location + _PROJECTNAME + '.js'));
	gulp.src([dist.js.location + _PROJECTNAME + '.js'])
		.pipe(rename({
			extname: '.min.js'
		}))
		.pipe(uglify({
			preserveComments: 'some'
		}))
		.pipe(gulp.dest(dist.js.location));
});

// Images

gulp.task('resizeLargePhotos', function () {
	gulp.src(source.images.largePhotos.location + source.images.largePhotos.content)
		.pipe(imageResize({
			height : 960,
			upscale : false
		}))
		.pipe(gulp.dest(dist.location + source.images.largePhotos.location));
});

gulp.task('tinyImages', function () {
	gulp.src(source.images.location + source.images.content)
		.pipe(tinypng(tinypngToken))
		.pipe(gulp.dest(source.images.location));
});

gulp.task('tinyLargePhotos', function () {
	gulp.src(source.images.largePhotos.location + source.images.largePhotos.content)
		.pipe(tinypng(tinypngToken))
		.pipe(gulp.dest(source.images.largePhotos.location));
});

gulp.task('tiny', ['tinyImages', 'tinyLargePhotos']);

gulp.task('watch', function () {
	gulp.watch(source.css.location + source.css.content, ['css']);
});

gulp.task('watch', ['css'], function () {
	browserSync.reload();
});

// Watch scss AND html files, doing different things with each.
gulp.task('serve', ['oai'], function () {

	// Serve files from the root of this project
	browserSync.init({
		server: {
			baseDir: "./"
		}
	});

	gulp.watch(source.css.location + source.css.content, ['oai-watch']);
	gulp.watch(source.index.content).on("change", browserSync.reload);

});

gulp.task('default', ['serve']);