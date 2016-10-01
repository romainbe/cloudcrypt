'use strict'

var mkdirp = require('mkdirp');
var fs = require('fs');

var LocalFile = function (metadata, crypto_extension) {
    this.metadata = metadata;
    this.crypto_extension = crypto_extension;
    if (this.crypto_extension == undefined) {
        this.crypto_extension = 'pgp';
    }
}

LocalFile.prototype.getFileName = function () {
    var len = this.crypto_extension.length + 1;
    return this.metadata.name.slice(0, this.metadata.name.length - len);
}

LocalFile.prototype.getLocalDir = function () {
    var last_slash_pos = this.metadata.path_display.lastIndexOf('/') + 1;

    return this.metadata.path_display.slice(0, last_slash_pos);
}

LocalFile.prototype.canMkdir = function (dir_path) {
    var ret_val = true;
    try {
        var file_stats = fs.statSync(dir_path);
        if (!file_stats.isDirectory()) {
            ret_val = false;
        }
    } catch (err) {
        if (err.code != 'ENOENT') {
            ret_val = false;
            console.log(err);
        }
    }
    return ret_val;
}

LocalFile.prototype.mklocaldir = function (dir_path) {
    try {
        mkdirp.sync(dir_path);
    } catch (err) {
        console.log(err);
        throw err;
    }
}

LocalFile.prototype.mklocaldirIfNotExists = function (dir_path) {
    if (this.canMkdir(dir_path) == true) {
        this.mklocaldir(dir_path);
    }
}

exports.LocalFile = LocalFile;

