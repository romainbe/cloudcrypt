'use strict'

var config = require('./config');
var DataEncrypt = require('./DataEncrypt')
var fs = require('fs');
var dropbox = require('./DropboxConnector');

fs.readFile(config.conf.fileName, function (err, data) {
    if (err) {
        console.log(err);
    }

    var d_encrypt = new DataEncrypt.DataEncrypt(config.pubkey);
    var options = d_encrypt.getOptions(config.conf.fileName);
    if (options != undefined) {
        var dbx_ctor = new dropbox.DropboxConnector();
        dbx_ctor.init(config.conf.dropbox_access_token);
        
        d_encrypt.encrypt(options, dbx_ctor);
    }
});