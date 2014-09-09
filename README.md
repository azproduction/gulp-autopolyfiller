# gulp-autopolyfiller

[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url]  [![Coverage Status][coveralls-image]][coveralls-url] [![Dependency Status][depstat-image]][depstat-url]

Autopolyfiller - Precise polyfills. Automatic and minimal polyfills for your code.

It accepts multiply js files and returns a file with all required polyfills. **Please note**: all input files will be dropped from the output stream of autopolyfiller. To concat polyfills with all your js files please refer to examples.

## Usage

First, install `gulp-autopolyfiller` as a development dependency:

```shell
npm install --save-dev gulp-autopolyfiller
```

Then, add it to your `gulpfile.js`:

```js
var autopolyfiller = require('gulp-autopolyfiller');

gulp.task('autopolyfiller', function () {
    return gulp.src('./lib/**/*.js')
        .pipe(autopolyfiller('result_polyfill_file.js'))
        .pipe(gulp.dest('./dist'));
});
```

## API

### autopolyfiller(fileName, options)

#### options.browsers
Type: `Array`
Default value: `[]` - all browsers

#### options.include
Type: `Array`
Default value: `[]` - list of extra polyfills to add

#### options.exclude
Type: `Array`
Default value: `[]` - list of polyfills to remove

List of target browsers. Autopolyfiller uses Autoprefixer-style browsers format.
See [Browsers format](https://github.com/ai/autoprefixer#browsers) for details.

## Examples

#### Basic

Steps:

 - Concat all scripts
 - Generate polyfills
 - Append polyfills
 - Uglify

```js
var gulp = require('gulp');
var concat = require('gulp-concat');
var order = require('gulp-order');
var uglify = require('gulp-uglify');
var autopolyfiller = require('gulp-autopolyfiller');
var merge = require('event-stream').merge;

gulp.task('default', function () {
    // Concat all required js files
    var all = gulp.src('js/*.js')
        .pipe(concat('all.js'));

    // Generate polyfills for all files
    var polyfills = all
        .pipe(autopolyfiller('polyfills.js'));

    // Merge polyfills and all files streams
    return merge(polyfills, all)
        // Order files. NB! polyfills MUST be first
        .pipe(order([
            'polyfills.js',
            'all.js'
        ]))
        // Make single file
        .pipe(concat('all.min.js'))
        // Uglify it
        .pipe(uglify())
        // And finally write `all.min.js` into `build/` dir
        .pipe(gulp.dest('build'));
});
```

#### Browsers targets

You can specify list of target browsers to reduce amount of polyfills.

```js
var autopolyfiller = require('gulp-autopolyfiller');

gulp.src('./your/js/**/*.js')
	.pipe(autopolyfiller('result_polyfill_file.js', {
        browsers: ['last 2 version', 'ie 8', 'ie 9']
    }))
	.pipe(gulp.dest('./dist'));
```

#### Default browsers of Autoprefixer

```js
var autopolyfiller = require('gulp-autopolyfiller');

gulp.src('./your/js/**/*.js')
	.pipe(autopolyfiller('result_polyfill_file.js', {
		browsers: require('autoprefixer').default
	}))
	.pipe(gulp.dest('./dist'));
```

#### Removig polyfills

```js
var autopolyfiller = require('gulp-autopolyfiller');

gulp.src('./your/js/**/*.js')
	.pipe(autopolyfiller('polyfills_without_promises.js', {
		exclude: ['Promise']
	}))
	.pipe(gulp.dest('./dist'));
```

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)

[npm-url]: https://npmjs.org/package/gulp-autopolyfiller
[npm-image]: https://badge.fury.io/js/gulp-autopolyfiller.png

[travis-url]: http://travis-ci.org/azproduction/gulp-autopolyfiller
[travis-image]: https://secure.travis-ci.org/azproduction/gulp-autopolyfiller.png?branch=master

[coveralls-url]: https://coveralls.io/r/azproduction/gulp-autopolyfiller
[coveralls-image]: https://coveralls.io/repos/azproduction/gulp-autopolyfiller/badge.png

[depstat-url]: https://gemnasium.com/azproduction/gulp-autopolyfiller
[depstat-image]: https://gemnasium.com/azproduction/gulp-autopolyfiller.png
