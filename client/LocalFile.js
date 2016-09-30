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

exports.LocalFile = LocalFile;

