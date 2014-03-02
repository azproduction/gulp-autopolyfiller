var autopolyfiller = require('autopolyfiller'),
    path = require('path'),
    through = require('through'),
    gutil = require('gulp-util'),
    PluginError = gutil.PluginError,
    File = gutil.File;

var PLUGIN_NAME = 'gulp-autopolyfiller';

module.exports = function (fileName, options) {
	'use strict';

    if (!fileName) {
        throw new PluginError(PLUGIN_NAME,  'Missing `fileName` argument for ' + PLUGIN_NAME);
    }

    options = options || {};
    if (!options.browsers) {
        options.browsers = [];
    }

    var polyfiller = autopolyfiller(options.browsers),
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
