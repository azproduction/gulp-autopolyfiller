/*global describe, it, beforeEach, afterEach*/
/*jshint expr:true, maxstatements:50*/

var autopolyfiller = require('..'),
    expect = require('chai').expect,
    path = require('path'),
    gutil = require('gulp-util'),
    PluginError = gutil.PluginError,
    File = gutil.File,
    Readable = require('stream').Readable;

describe('gulp-autopolyfiller', function() {

    it('throws an error if `fileName` is not specified', function () {
        expect(function () {
            autopolyfiller();
        }).to.throw(Error);
    });

    it('does not support streams', function (done) {
        var stream = autopolyfiller('test.js');

        var fakeStream = new File({
            cwd: '/home/autopolyfiller/',
            base: '/home/autopolyfiller/test',
            path: '/home/autopolyfiller/test/String.prototype.trim.js',
            contents: new Readable()
        });

        stream.on('error', function (error) {
            expect(error).to.be.instanceof(PluginError);
            done();
        });
        stream.write(fakeStream);
        stream.end();
    });

    it('skips empty and null files', function (done) {
        var stream = autopolyfiller('test.js');

        var nullFile = new File({
            cwd: '/home/autopolyfiller/',
            base: '/home/autopolyfiller/test',
            path: '/home/autopolyfiller/test/String.prototype.trim.js',
            contents: null
        });

        stream.on('data', function () {
            done(new Error('data should not be emitted'));
        });
        stream.on('end', function () {
            done();
        });
        stream.write(nullFile);
        stream.end();
    });

    it('generates polyfills for all browsers', function(done) {
        var stream = autopolyfiller('test.js');

        var fakeFile = new File({
            cwd: '/home/autopolyfiller/',
            base: '/home/autopolyfiller/test',
            path: '/home/autopolyfiller/test/String.prototype.trim.js',
            contents: new Buffer('"".trim();')
        });

        var fakeFile2 = new File({
            cwd: '/home/autopolyfiller/',
            base: '/home/autopolyfiller/test',
            path: '/home/autopolyfiller/test/Promise.js',
            contents: new Buffer('new Promise();')
        });

        stream.on('data', function (newFile) {
            expect(newFile).to.exists;
            expect(newFile.path).to.exists;
            expect(newFile.relative).to.exists;
            expect(newFile.contents).to.exists;

            var newFilePath = path.resolve(newFile.path);
            var expectedFilePath = path.resolve('/home/autopolyfiller/test/test.js');
            expect(newFilePath).to.equal(expectedFilePath);

            expect(newFile.relative).to.equal('test.js');

            var polyfills = String(newFile.contents);
            expect(polyfills).to.match(/String\.prototype\.trim/);
            expect(polyfills).to.match(/Promise/);

            expect(Buffer.isBuffer(newFile.contents)).to.equal(true);
            done();
        });
        stream.write(fakeFile);
        stream.write(fakeFile2);
        stream.end();
    });

    it('generates polyfills for specific browsers', function(done) {
        var stream = autopolyfiller('test.js', {
            browsers: ['Chrome 30']
        });

        var fakeFile = new File({
            cwd: '/home/autopolyfiller/',
            base: '/home/autopolyfiller/test',
            path: '/home/autopolyfiller/test/String.prototype.trim.js',
            contents: new Buffer('"".trim();')
        });

        var fakeFile2 = new File({
            cwd: '/home/autopolyfiller/',
            base: '/home/autopolyfiller/test',
            path: '/home/autopolyfiller/test/Promise.js',
            contents: new Buffer('new Promise();')
        });

        stream.on('data', function (newFile) {
            expect(newFile).to.exists;
            expect(newFile.path).to.exists;
            expect(newFile.relative).to.exists;
            expect(newFile.contents).to.exists;

            var newFilePath = path.resolve(newFile.path);
            var expectedFilePath = path.resolve('/home/autopolyfiller/test/test.js');
            expect(newFilePath).to.equal(expectedFilePath);

            expect(newFile.relative).to.equal('test.js');

            var polyfills = String(newFile.contents);
            expect(polyfills).to.not.match(/String\.prototype\.trim/);
            expect(polyfills).to.match(/Promise/);

            expect(Buffer.isBuffer(newFile.contents)).to.equal(true);
            done();
        });
        stream.write(fakeFile);
        stream.write(fakeFile2);
        stream.end();
    });

    it('includes extra polyfills in build result', function(done) {
        var stream = autopolyfiller('test.js', {
            include: ['Promise']
        });

        var fakeFile = new File({
            cwd: '/home/autopolyfiller/',
            base: '/home/autopolyfiller/test',
            path: '/home/autopolyfiller/test/String.prototype.trim.js',
            contents: new Buffer('"".trim();')
        });

        stream.on('data', function (newFile) {
            expect(newFile).to.exists;
            expect(newFile.path).to.exists;
            expect(newFile.relative).to.exists;
            expect(newFile.contents).to.exists;

            var newFilePath = path.resolve(newFile.path);
            var expectedFilePath = path.resolve('/home/autopolyfiller/test/test.js');
            expect(newFilePath).to.equal(expectedFilePath);

            expect(newFile.relative).to.equal('test.js');

            var polyfills = String(newFile.contents);
            expect(polyfills).to.match(/String\.prototype\.trim/);
            expect(polyfills).to.match(/Promise/);

            expect(Buffer.isBuffer(newFile.contents)).to.equal(true);
            done();
        });
        stream.write(fakeFile);
        stream.end();
    });

    it('excludes polyfills from build result', function(done) {
        var stream = autopolyfiller('test.js', {
            exclude: ['String.prototype.trim']
        });

        var fakeFile = new File({
            cwd: '/home/autopolyfiller/',
            base: '/home/autopolyfiller/test',
            path: '/home/autopolyfiller/test/String.prototype.trim.js',
            contents: new Buffer('"".trim();')
        });

        var fakeFile2 = new File({
            cwd: '/home/autopolyfiller/',
            base: '/home/autopolyfiller/test',
            path: '/home/autopolyfiller/test/Promise.js',
            contents: new Buffer('new Promise();')
        });

        stream.on('data', function (newFile) {
            expect(newFile).to.exists;
            expect(newFile.path).to.exists;
            expect(newFile.relative).to.exists;
            expect(newFile.contents).to.exists;

            var newFilePath = path.resolve(newFile.path);
            var expectedFilePath = path.resolve('/home/autopolyfiller/test/test.js');
            expect(newFilePath).to.equal(expectedFilePath);

            expect(newFile.relative).to.equal('test.js');

            var polyfills = String(newFile.contents);
            expect(polyfills).to.not.match(/String\.prototype\.trim/);

            expect(Buffer.isBuffer(newFile.contents)).to.equal(true);
            done();
        });

        stream.write(fakeFile);
        stream.write(fakeFile2);
        stream.end();
    });

    it('can use a custom parser', function(done) {
        var stream = autopolyfiller('test.js', {
            parser: 'esprima-fb',
            parser_options: {}
        });

        var fakeFile = new File({
            cwd: '/home/autopolyfiller/',
            base: '/home/autopolyfiller/test',
            path: '/home/autopolyfiller/test/String.prototype.trim.js',
            contents: new Buffer('"".trim();')
        });

        stream.on('data', function (newFile) {
            expect(newFile).to.exists;
            expect(newFile.path).to.exists;
            expect(newFile.relative).to.exists;
            expect(newFile.contents).to.exists;

            var newFilePath = path.resolve(newFile.path);
            var expectedFilePath = path.resolve('/home/autopolyfiller/test/test.js');
            expect(newFilePath).to.equal(expectedFilePath);

            expect(newFile.relative).to.equal('test.js');

            var polyfills = String(newFile.contents);
            expect(polyfills).to.match(/String\.prototype\.trim/);

            expect(Buffer.isBuffer(newFile.contents)).to.equal(true);
            done();
        });

        stream.write(fakeFile);
        stream.end();
    });

});
