'use strict'

var LocalFile = function (metadata) {
    this.metadata = metadata;
}

LocalFile.prototype.getFileName = function () {
    return this.metadata.name;
}

LocalFile.prototype.getLocalDir = function () {
    return 'tmp';
}

exports.LocalFile = LocalFile;

