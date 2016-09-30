'use strict'

var assert = require('assert');
var simple = require('simple-mock');
var LocalFile = require('../LocalFile');

describe('LocalFile', function() {
    var metadata = {
        name: 'some_file.txt.pgp',
        path_display: '/some/path/some_file.txt.pgp'
    };
    describe('getFileName', function() {
        it('should return the name without the pgp extension',
        function() {
            var local_file = new LocalFile.LocalFile(metadata);
            assert.equal('some_file.txt', local_file.getFileName());
        });

        it('should return the name without the custom extension',
        function() {
            metadata.name = 'some_file.txt.foobar'
            var local_file = new LocalFile.LocalFile(metadata, 'foobar');
            assert.equal('some_file.txt', local_file.getFileName());
        });
    });

    describe('getLocalDir', function() {
        it('should return the directory path', function() {
            var local_file = new LocalFile.LocalFile(metadata);
            assert.equal('/some/path/', local_file.getLocalDir());
        });
    });

    describe('createDirIfNotExist', function () {
        var local_file = new LocalFile.LocalFile(metadata);
        beforeEach(function () {
            simple.mock(local_file, 'mklocaldir')
                .callFn(function (dir_path) { });
            simple.mock(local_file, 'dirExists')
                .callFn(function (dir_path) { return false; });
        });

        afterEach(function () {
            simple.restore();
        });

        it ('should call dirExists', function () {
            local_file.mklocaldirIfNotExists('path');

            assert(local_file.dirExists.called);
            assert.equal(1, local_file.dirExists.callCount);
        });

        it('should call mklocaldir if the directory does not exist', function () {
            local_file.mklocaldirIfNotExists('path');

            assert(local_file.mklocaldir.called);
            assert.equal(1, local_file.mklocaldir.callCount);
        });

        it ('should NOT call mklocaldir if the directory exist', function () {
            simple.mock(local_file, 'dirExists')
                .callFn(function (dir_path) { return true; });

            local_file.mklocaldirIfNotExists('path');

            assert.equal(false, local_file.mklocaldir.called);
        });
    });
});
