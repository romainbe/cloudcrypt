var config = require('./config');
var DataEncrypt = require('./DataEncrypt')
var fs = require('fs');

fs.readFile(config.conf.fileName, function (err, data) {
    if (err) {
        console.log(err);
    }

    var d_encrypt = new DataEncrypt.DataEncrypt(config.pubkey);
    var options = d_encrypt.getOptions(config.conf.fileName);
    if (options != undefined) {
        d_encrypt.encrypt(options);
    }
});