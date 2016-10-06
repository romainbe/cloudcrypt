'use strict'

var config = require('./config');
var FilesConfig = require('./FilesConfig');
var dropbox = require('./DropboxConnector');
var local_file = require('./LocalFile');
var fs = require('fs');
var data_decrypt = require('./DataDecrypt');

var Decrypt = function () {
    var files_config = new FilesConfig.FilesConfig(config.files_to_crypt);
    this.files_list = files_config.getAllFiles();
    
    if (this.files_list.length) {
        var dbx_ctor = new dropbox.DropboxConnector();
        this.dbx = dbx_ctor.init(config.conf.dropbox_access_token);
    }

    this.done = false;
    this.last_cursor = '';
}

Decrypt.prototype.getLatestCursorAndPollRemote = function () {
    var self = this;
    if (this.files_list.length) {
        self.dbx.filesListFolderGetLatestCursor({
            path: '',
            recursive: true,
            include_media_info: false,
            include_deleted: false,
            include_has_explicit_shared_members: false
        })
        .then((last_cursor) => {
            console.log(last_cursor.cursor);
            self.last_cursor = last_cursor.cursor;
            self.dropboxLongpollAtInterval();
        })
        .catch((err) => {
            console.log(error);
        });
    }
}

Decrypt.prototype.dropboxLongpollAtInterval = function () {
   var self = this;
    
    setInterval(function () {
        if (!self.done) {
            var longpoll_args = {
                cursor: self.last_cursor,
                timeout: 30
            };

            self.done = true;
            console.log('start polling');
            self.dbx.filesListFolderLongpoll(longpoll_args)
                .then((result) => {
                    console.log(result);
                    if (result.changes == true) {
                        self.syncLocalWithRemote()
                    } else {
                        self.done = false;
                    }
                })
                .catch((err) => { 
                    console.log(err);
                    self.done = false;
                });
        }
    }, 2000);
}

Decrypt.prototype.syncLocalWithRemote = function () {
    var self = this;

    self.dbx.filesListFolderContinue({cursor: self.last_cursor})
        .then((results) => {
            console.log(results);
            results.entries.forEach((file) => {
                console.log(file.path_display);
                console.log(self.files_list);

                self.last_cursor = results.cursor;
                
                var file_name = file.path_display.slice(0, file.path_display.length - 4);
                if (self.files_list.indexOf(file_name) != -1) {
                    var local_f = new local_file.LocalFile();
                    var local_dir = local_f.getLocalDir(file_name);

                    if (local_f.mklocaldir(local_dir) == true) {
                        this.downloadAndDecryptFile(local_f, file_name);
                    }
                }
            });
            if (results.hasMore) {
                self.syncLocalWithRemote();
            } else {
                self.done = false;
            }
        })
        .catch((err) => {
            console.log('continue error : ' + err);
        });
}

Decrypt.prototype.downloadAndDecryptFile = function (local_f, file) {
    
    var file_dl_info = {
        path: file + '.pgp'
    };

    var self = this;
    this.dbx.filesDownload(file_dl_info)
        .then((metadata) => {
            console.log(metadata.name + ' downloaded!');
            local_f.setMetadata(metadata);

            self.decryptFile(local_f, file);
        })
        .catch((error) => {
            console.log(error);
        });
}

Decrypt.prototype.decryptFile = function (local_f, file) {
    var d_decrypt = new data_decrypt.DataDecrypt(config.seckey, config.passphrase)

    var options = d_decrypt.getOptions(local_f.metadata.fileBinary);
    if (options !== undefined) {
        var file_name = local_f.getLocalDir(file) + local_f.getFileName();
        d_decrypt.decrypt(options, file_name);
    }
}

Decrypt.prototype.getLatestCursor = function (dbx, files_list, cb, args) {
    dbx.filesListFolderGetLatestCursor({
            path: '',
            recursive: true,
            include_media_info: false,
            include_deleted: false,
            include_has_explicit_shared_members: false
        })
        .then((last_cursor) => {
            console.log(last_cursor.cursor);
            cb(dbx, last_cursor.cursor, files_list, args);
        })
        .catch((err) => {
            console.log(error);
        });
}

exports.Decrypt = Decrypt;
