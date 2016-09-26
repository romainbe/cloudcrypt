'use strict'

var FilesConfig = function (files_config) {
    if (files_config == undefined) {
        this.files = [];
    } else {
        this.files = files_config;
    }
}

FilesConfig.prototype.getAllFiles = function () {
    var files_list = [];
    
    for (var i = 0; i < this.files.length; i++) {
        var dirname = this.files[i].dir;
        if (dirname.slice(-1) !== '/') {
            dirname += '/';
        }

        for (var j = 0; j < this.files[i].files.length; j++) {
            files_list.push(dirname + this.files[i].files[j]);
        }
    }

    return files_list;
}

exports.FilesConfig = FilesConfig;