'use strict'

var config = require('./config');
var FilesConfig = require('./FilesConfig');
var dropbox = require('./DropboxConnector');
var local_file = require('./LocalFile');
var fs = require('fs');
var data_decrypt = require('./DataDecrypt');

main();

function main() {
    var files_config = new FilesConfig.FilesConfig(config.files_to_crypt);
    var files_list = files_config.getAllFiles();

    if (files_list.length) {
        var dbx_ctor = new dropbox.DropboxConnector();
        var dbx = dbx_ctor.init(config.conf.dropbox_access_token);

        getLatestCursorAndPollRemote(dbx, files_list);
    }
}

function getLatestCursorAndPollRemote(dbx, files_list) {
     dbx.filesListFolderGetLatestCursor({
            path: '',
            recursive: true,
            include_media_info: false,
            include_deleted: false,
            include_has_explicit_shared_members: false
        })
        .then((last_cursor) => {
            console.log(last_cursor.cursor);
            dropboxLongpollAtInterval(dbx, last_cursor.cursor, files_list);
        })
        .catch((err) => {
            console.log(error);
        });
}

function dropboxLongpollAtInterval(dbx, last_cursor, files_list) {
    var longpoll_args = {
        cursor: last_cursor,
        timeout: 30
    };
    
    var done = false;
    setInterval(function () {
        if (!done) {
            done = true;
            dbx.filesListFolderLongpoll(longpoll_args)
                .then((result) => {
                    console.log(result);
                    if (result.changes == true) {
                        syncLocalWithRemote(dbx, files_list)
                    }
                    
                    done = false;
                })
                .catch((err) => { 
                    console.log(err);
                    done = false;
                });
        }
    }, 35000);
}

function syncLocalWithRemote(dbx, files_list) {
    files_list.forEach((file) => {
        var local_f = new local_file.LocalFile();
        var local_dir = local_f.getLocalDir(file);

        var args = {
            local_f: local_f,
            file: file,
            dbx: dbx
        };

        local_f.mklocaldir(local_dir, downloadAndDecryptFile, args);
    });
}

function downloadAndDecryptFile(local_f, file, dbx) {
    var file_dl_info = {
        path: file + '.pgp'
    };

    dbx.filesDownload(file_dl_info)
        .then((metadata) => {
            console.log(metadata.name + ' downloaded!');
            local_f.setMetadata(metadata);

            decryptFile(local_f, file);
        })
        .catch((error) => {
            console.log(error);
        });
}

function decryptFile(local_f, file) {
    var d_decrypt = new data_decrypt.DataDecrypt(config.seckey, config.passphrase)

    var options = d_decrypt.getOptions(local_f.metadata.fileBinary);
    if (options !== undefined) {
        var file_name = local_f.getLocalDir(file) + local_f.getFileName();
        d_decrypt.decrypt(options, file_name);
    }
}