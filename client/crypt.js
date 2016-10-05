'use strict'

var config = require('./config');
var FilesConfig = require('./FilesConfig');
var DataEncrypt = require('./DataEncrypt')
var fs = require('fs');
var dropbox = require('./DropboxConnector');

main();

function main() {
    var files_config = new FilesConfig.FilesConfig(config.files_to_crypt);
    var files_list = files_config.getAllFiles();

    if (files_list.length) {

        var d_encrypt = new DataEncrypt.DataEncrypt(config.pubkey);
        var dbx_ctor = new dropbox.DropboxConnector();
        dbx_ctor.init(config.conf.dropbox_access_token);

        files_list.forEach((file_name) => {
            fs.readFile(file_name, function (err, data) {
                if (err) {
                    console.log(err);
                    return ;
                }
                var options = d_encrypt.getOptions(data);
                if (options != undefined) {
                    d_encrypt.encrypt(options, dbx_ctor, file_name);
                }
            });
        });
    }
}
