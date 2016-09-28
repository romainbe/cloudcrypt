'use strict'

var openpgp = require('openpgp');
var fs = require('fs');

var DataDecrypt = function(seckey, pubkey) {
    if (seckey != undefined) {
        this.seckey = openpgp.key.readArmored(seckey);
    }
    
    if (pubkey != undefined) {
        this.pubkey = openpgp.key.readArmored(pubkey).keys;
    }
}

DataDecrypt.prototype.decrypt = function (options, decrypted_file) {
    var self = this;
    openpgp.decryptKey({privateKey: self.seckey.keys[0], passphrase: 'test'})
        .then(function (unlocked) {
            options.privateKey = self.seckey.keys[0]
            openpgp.decrypt(options).then(function(plaintext) {
                fs.writeFile(decrypted_file, plaintext.data, function(err) {
                    if (err) console.log(err);
                    else console.log(decrypted_file + ' written!');
                });

        }).catch(function (err) {console.log(err)});
    }).catch(function (err) {console.log(err)});
}

DataDecrypt.prototype.getOptions = function(data) {
    if (this.seckey == undefined) {
        return undefined;
    } else if (data == undefined || data.length == 0) {
        return undefined;
    }
    
    var options = {
        message: openpgp.message.readArmored(data),
        privateKey: this.seckey
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