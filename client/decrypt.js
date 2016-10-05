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
}

Decrypt.prototype.getLatestCursorAndPollRemote = function () {
    if (this.files_list.length) {
        this.getLatestCursor(this.dbx, this.files_list, this.dropboxLongpollAtInterval, this);
    }
}

Decrypt.prototype.dropboxLongpollAtInterval = function (dbx, last_cursor, files_list, self) {
    var longpoll_args = {
        cursor: last_cursor,
        timeout: 30
    };

    setInterval(function () {
        if (!self.done) {
            self.done = true;
            dbx.filesListFolderLongpoll(longpoll_args)
                .then((result) => {
                    console.log(result);
                    if (result.changes == true) {
                        self.syncLocalWithRemote(dbx, files_list)
                        self.getLatestCursor(dbx, files_list,
                        (dbx, last_cursor_cb, files_list, args) => {
                            args.cursor = last_cursor_cb
                            self.done = false;
                        }, longpoll_args);
                    }
                    
                    self.done = false;
                })
                .catch((err) => { 
                    console.log(err);
                    self.done = false;
                });
        }
    }, 2000);
}

Decrypt.prototype.syncLocalWithRemote = function (dbx, files_list) {
    files_list.forEach((file) => {
        var local_f = new local_file.LocalFile();
        var local_dir = local_f.getLocalDir(file);

        var args = {
            local_f: local_f,
            file: file,
            dbx: dbx,
            self: this
        };

        local_f.mklocaldir(local_dir, this.downloadAndDecryptFile, args);
    });
}

Decrypt.prototype.downloadAndDecryptFile = function (local_f, file, dbx, self) {
    var file_dl_info = {
        path: file + '.pgp'
    };

    dbx.filesDownload(file_dl_info)
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

var decryptor = new Decrypt();
decryptor.getLatestCursorAndPollRemote();
