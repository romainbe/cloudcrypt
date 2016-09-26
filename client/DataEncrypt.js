'use strict'

var openpgp = require('openpgp');
var fs = require('fs');

var DataEncrypt = function(pubkey, seckey) {
    if (pubkey != undefined) {
        this.pubkey = openpgp.key.readArmored(pubkey).keys
    }

    if (seckey != undefined) {
        this.seckey = openpgp.key.readArmored(seckey).keys;
    }
}

DataEncrypt.prototype.encrypt = function(options, dbx_ctor, file_name) {
    openpgp.encrypt(options).then(function(ciphertext) {
        var encrypted = ciphertext.data;
        
        var dbx = dbx_ctor.getDbx();
        var file_infos = dbx_ctor.getFileInfos(encrypted, file_name + '.pgp');
        
        dbx.filesUpload(file_infos);
    });
}

DataEncrypt.prototype.getOptions = function(data) {
    if (this.pubkey == undefined) {
        return undefined;
    } else if (data.length == 0 || data == undefined) {
        return undefined;
    }
    
    var options = {
        data: data,
        publicKeys: this.pubkey
    };

    if (this.seckey != undefined) {
        options.privateKeys = this.seckey;
    }
    
    return options;
}

DataEncrypt.prototype.setPublicKey = function (pubkey) {
    this.pubkey = pubkey;
}

DataEncrypt.prototype.setPrivateKey = function (seckey) {
    this.seckey = seckey;
}

exports.DataEncrypt = DataEncrypt;