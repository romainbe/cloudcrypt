'use strict'

var config = require('./config');
var FilesConfig = require('./FilesConfig');
var dropbox = require('./DropboxConnector');

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
            })
            .catch((error) => {
                console.log(error);
            });
    });
    
}