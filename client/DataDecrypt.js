'use strict'

var openpgp = require('openpgp');
var fs = require('fs');

var DataDecrypt = function(seckey, pubkey) {
    if (seckey != undefined) {
        this.seckey = openpgp.key.readArmored(seckey).keys;
    }
    
    if (pubkey != undefined) {
        this.pubkey = openpgp.key.readArmored(pubkey).keys
    }
}

DataDecrypt.prototype.getOptions = function(data) {
    if (this.seckey == undefined) {
        return undefined;
    } else if (data == undefined || data.length == 0) {
        return undefined;
    }
    
    var options = {
        data: openpgp.message.readArmored(data),
        privateKeys: this.seckey
    };

    if (this.pubkey != undefined) {
        options.publicKeys = this.pubkey;
    }
    
    return options;
}

DataDecrypt.prototype.setPublicKey = function (pubkey) {
    this.pubkey = pubkey;
}

DataDecrypt.prototype.setPrivateKey = function (seckey) {
    this.seckey = seckey;
}

exports.DataDecrypt = DataDecrypt;