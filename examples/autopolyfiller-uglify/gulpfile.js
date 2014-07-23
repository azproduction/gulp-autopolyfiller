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
