'use strict'

var openpgp = require('openpgp');

var DataEncrypt = function(pubkey, seckey) {
    if (pubkey != undefined) {
        this.pubkey = openpgp.key.readArmored(pubkey).keys
    }

    if (seckey != undefined) {
        this.seckey = openpgp.key.readArmored(seckey).keys;
    }
}

DataEncrypt.prototype.encrypt = function(options)
{
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

exports.DataEncrypt = DataEncrypt;