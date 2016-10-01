'use strict'

var openpgp = require('openpgp');
var fs = require('fs');

var DataDecrypt = function(seckey, passphrase, pubkey) {
    if (seckey != undefined) {
        this.seckey = openpgp.key.readArmored(seckey);
    }
    
    this.passphrase = '';
    if (passphrase != undefined) {
        this.passphrase = passphrase;
    }

    if (pubkey != undefined) {
        this.pubkey = openpgp.key.readArmored(pubkey).keys;
    }
}

DataDecrypt.prototype.decrypt = function (options, decrypted_filename) {
    var self = this;
    openpgp.decryptKey({
            privateKey: options.privateKey.keys[0],
            passphrase: this.passphrase
        })
        .then(function (unlocked) {
            options.privateKey = options.privateKey.keys[0];
            
            openpgp.decrypt(options).then(function(decrypted_data) {
                self.writeDecryptedFile(decrypted_data, decrypted_filename);
        }).catch(function (err) {console.log(err)});
    }).catch(function (err) {console.log(err)});
}

DataDecrypt.prototype.writeDecryptedFile 
    = function (decrypted_data, decrypted_filename) {

    /* I'm not to sure that's the best way to write a file 
    * from an Uint8Array...*/
    var buffer = new Buffer(decrypted_data.data.length);
    for (var i = 0; i < decrypted_data.data.length; i++) {;
        buffer.writeUInt8(decrypted_data.data[i], i);
    }

    fs.writeFile(decrypted_filename, buffer, function(err) {
        if (err) console.log(err);
        else console.log(decrypted_filename + ' written!');
    });
}

DataDecrypt.prototype.getOptions = function(data) {
    if (this.seckey == undefined) {
        return undefined;
    } else if (data == undefined || data.length == 0) {
        return undefined;
    }
    
    var options = {
        message: openpgp.message.readArmored(data.toString()),
        privateKey: this.seckey,
        format: 'binary'
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