'use strict'

var config = require('./config');
var FilesConfig = require('./FilesConfig');
var dropbox = require('./DropboxConnector');
var local_file = require('./LocalFile');
var fs = require('fs');
var data_decrypt = require('./DataDecrypt');

var files_config = new FilesConfig.FilesConfig(config.files_to_crypt);
var files_list = files_config.getAllFiles();

if (files_list.length) {
    var dbx_ctor = new dropbox.DropboxConnector();
    var dbx = dbx_ctor.init(config.conf.dropbox_access_token);

    files_list.forEach((file) => {
        var local_f = new local_file.LocalFile();
        var local_dir = local_f.getLocalDir(file);

            var args = {
                local_f: local_f,
                file: file
            };

            local_f.mklocaldir(local_dir, downloadAndDecryptFile, args);
    });
}

function downloadAndDecryptFile(local_f, file) {
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