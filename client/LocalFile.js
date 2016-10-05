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

LocalFile.prototype.getLocalDir = function (full_path) {
    if (full_path == undefined) {
        full_path = this.metadata.path_display;
    }
    var last_slash_pos = full_path.lastIndexOf('/') + 1;
    return full_path.slice(0, last_slash_pos);
}

LocalFile.prototype.mklocaldir = function (local_dir, cb, args) {
    mkdirp(local_dir, (err) => {
        if (err) {
            console.log('could not create ' + local_dir + ', cannot get ' + args.file);
            console.log(err);
        } else {
            cb(args.local_f, args.file, args.dbx, args.self);
        }
    });
}

LocalFile.prototype.setMetadata = function (metadata) {
    this.metadata = metadata;
}

exports.LocalFile = LocalFile;