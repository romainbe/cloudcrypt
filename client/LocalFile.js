'use strict'

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

LocalFile.prototype.dirExists = function (dir_path) {
    return true;
}

LocalFile.prototype.mklocaldir = function (dir_path) {
    
}

LocalFile.prototype.mklocaldirIfNotExists = function (dir_path) {
    if (this.dirExists(dir_path)  == false) {
        this.mklocaldir(dir_path);
    }
}

exports.LocalFile = LocalFile;

