var autopolyfiller = require('autopolyfiller'),
    path = require('path'),
    through = require('through'),
    gutil = require('gulp-util'),
    PluginError = gutil.PluginError,
    File = gutil.File;

var PLUGIN_NAME = 'gulp-autopolyfiller';

function defaults(options) {
    options = options || {};

    return Object.keys(options).reduce(function(defaults, key) {
        defaults[key] = options[key];
        return defaults;
    }, {
        browsers: [],
        include: [],
        exclude: [],
        parser: null,
        parser_options: {}
    });
}

/**
 *
 * @param {Object} [options]
 * @param {String[]} [options.browsers]
 * @param {String[]} [options.include]
 * @param {String[]} [options.exclude]
 * @param {String} [options.parser]
 * @param {*} [options.parser_options]
 *
 * @returns {AutoPolyFiller}
 */
function autopolyfillerCreate(options) {
    var polyfiller = autopolyfiller(options.browsers)
        .include(options.include)
        .exclude(options.exclude);

    if (typeof options.parser === 'string') {
        polyfiller.withParser(require(options.parser), options.parser_options);
    }

    return polyfiller;
}

module.exports = function (fileName, options) {
	'use strict';

    if (!fileName) {
        throw new PluginError(PLUGIN_NAME,  'Missing `fileName` argument for ' + PLUGIN_NAME);
    }

    var polyfiller = autopolyfillerCreate(defaults(options)),
        firstFile = null;

    function scanContents (file) {
        /*jshint validthis:true*/
        if (file.isNull()) {
            return;
        }

        if (file.isStream()) {
            this.emit('error', new PluginError(PLUGIN_NAME, 'Streaming not supported'));
            return;
        }

        if (!firstFile) {
            firstFile = file;
        }

        polyfiller.add(file.contents.toString('utf8'));
    }

    function emitPolyfills () {
        /*jshint validthis:true*/
        if (polyfiller.polyfills.length === 0) {
            this.emit('end');
            return;
        }

        var polyfillsCode = polyfiller.toString(),
            polyfillsPath = path.join(firstFile.base, fileName);

        var polyfillsFile = new File({
            cwd: firstFile.cwd,
            base: firstFile.base,
            path: polyfillsPath,
            contents: new Buffer(polyfillsCode)
        });

        this.emit('data', polyfillsFile);
        this.emit('end');
    }

	return through(scanContents, emitPolyfills);
};
