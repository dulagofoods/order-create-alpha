const _PROJECTNAME = 'base';

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

const tinypngToken = false;

// Source Content structure

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
	content: '**/*.html',
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

// Source Content structure

var dist = {
	content: '*',
	location: 'dist/'
};

dist.css = source.css;
dist.css.location = dist.location + dist.css.location;

dist.js = source.js;
dist.js.location = dist.location + dist.js.location;

dist.index = source.index;
dist.index.location = dist.location + dist.index.location;

dist.images = source.images;
dist.images.location = dist.location + dist.images.location;

// CSS

gulp.task('css', function() {
	gulp.src(source.css.location + source.css.content)
		.pipe(concat(_PROJECTNAME + '.css'))
		.pipe(gulp.dest(dist.css.location))
		.pipe(minifycss())
		.pipe(rename({
			extname: '.min.css'
		}))
		.pipe(gulp.dest(dist.css.location));
});

gulp.task('css-watch', ['css'], function () {
	browserSync.reload();
});

// JS

gulp.task('js', function() {
	gulp.src(source.js.location + source.js.content)
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

gulp.task('js-watch', ['js'], function () {
	browserSync.reload();
});

// IMAGES

gulp.task('resizePhotos', function () {
	gulp.src(source.images.largePhotos.location + source.images.largePhotos.content)
		.pipe(imageResize({
			height : 960,
			upscale : false
		}))
		.pipe(gulp.dest(dist.location + source.images.largePhotos.location));
});

gulp.task('tinyPhotosSource', function () {
	if (tinypngToken)
		gulp.src(source.images.location + source.images.content)
			.pipe(tinypng(tinypngToken))
			.pipe(gulp.dest(source.images.location));
	else
		console.log('TinyPNG Token Required');
});

// SERVER

gulp.task('serve', function () {

	// Serve files from the root of this project
	browserSync.init({
		server: {
			baseDir: "./",
			index: "index.html",
			routes: {
				"/home": "./index.html"
			}
		}
	});

	gulp.watch([source.css.location + source.css.content], ['css-watch']);
	gulp.watch([source.js.location + source.js.content], ['js-watch']);
	gulp.watch(source.index.content).on("change", browserSync.reload);

});

gulp.task('default', ['serve']);