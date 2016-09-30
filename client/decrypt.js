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
        var file_dl_info = {
            path: file + '.pgp'
        };
        
        dbx.filesDownload(file_dl_info)
            .then((metadata) => 
            {
                console.log(metadata.name + ' downloaded!');
                var local_f = new local_file.LocalFile(metadata);

                decryptFile(local_f);
            })
            .catch((error) => {
                console.log(error);
            });
    });
}

function decryptFile(local_f) {
    var d_decrypt = new data_decrypt.DataDecrypt(config.seckey, config.passphrase)
    
    var options = d_decrypt.getOptions(local_f.metadata.fileBinary);

    if (options !== undefined) {
        var file_name = local_f.getLocalDir() + '/' + local_f.getFileName();
        d_decrypt.decrypt(options, file_name);
    }
}