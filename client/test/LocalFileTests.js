'use strict'

var assert = require('assert');
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
});
