'use strict'

var assert = require('assert');
var LocalFile = require('../LocalFile');

describe('LocalFile', function() {
    var metadata = {
        name: 'some_file.txt'
    };
    describe('getFileName', function() {
        it('should return the name supplied in metadata', function() {
            var local_file = new LocalFile.LocalFile(metadata);
            assert.equal('some_file.txt', local_file.getFileName());
        });
    });
    
     describe('getLocalDir', function() {
        it('should return tmp', function() {
            var local_file = new LocalFile.LocalFile(metadata);
            assert.equal('tmp', local_file.getLocalDir());
        });
    });
});
