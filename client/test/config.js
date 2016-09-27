var assert = require('assert');
var files_config = require('../FilesConfig');

describe('FilesConfig', function() {
    var files_to_crypt = [
        {dir: "/home/romain/", files: ["hello_world.txt"]},
        {dir: "/home/romain/Images/", files: ["romain.png", "logo2.png"]}
    ];

    describe('getAllFiles', function() {
        it('should return an empty array if no conf supplied', function() {
            var conf = new files_config.FilesConfig();
            assert.equal(0, conf.getAllFiles().length);
        });

        it('should return 3 full paths when the example conf is given', function() {
            var conf = new files_config.FilesConfig(files_to_crypt);
            var files = conf.getAllFiles();

            assert.equal(3, files.length);
            assert.equal("/home/romain/hello_world.txt", files[0]);
            assert.equal("/home/romain/Images/romain.png", files[1]);
            assert.equal("/home/romain/Images/logo2.png", files[2]);
        });
        
        it('should add a \'/\' when it is missing', function() {
            var my_files = [
                {dir: "/home/romain", files:["hello_world.txt"]}
            ];
            var conf = new files_config.FilesConfig(my_files);
            var files = conf.getAllFiles();
            assert.equal(1, files.length);
            assert.equal("/home/romain/hello_world.txt", files[0]);
        });
    });
});