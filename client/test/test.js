var assert = require('assert');
var openpgp = require('openpgp');
var data_encrypt = require('../DataEncrypt');

describe('DataEncrypt', function() {

    var pubkey = '-----BEGIN PGP PUBLIC KEY BLOCK-----\n' +
      'Version: OpenPGP.js v.1.20131011\n' +
      'Comment: http://openpgpjs.org\n' +
      '\n' +
      'xk0EUlhMvAEB/2MZtCUOAYvyLFjDp3OBMGn3Ev8FwjzyPbIF0JUw+L7y2XR5\n' +
      'RVGvbK88unV3cU/1tOYdNsXI6pSp/Ztjyv7vbBUAEQEAAc0pV2hpdGVvdXQg\n' +
      'VXNlciA8d2hpdGVvdXQudGVzdEB0LW9ubGluZS5kZT7CXAQQAQgAEAUCUlhM\n' +
      'vQkQ9vYOm0LN/0wAAAW4Af9C+kYW1AvNWmivdtr0M0iYCUjM9DNOQH1fcvXq\n' +
      'IiN602mWrkd8jcEzLsW5IUNzVPLhrFIuKyBDTpLnC07Loce1\n' +
      '=6XMW\n' +
      '-----END PGP PUBLIC KEY BLOCK-----';

    describe('getOptions', function() {
        it('should return undefined if data is empty', function() {
            var d_encrypt = new data_encrypt.DataEncrypt();
            assert.equal(undefined, d_encrypt.getOptions(''));
        });
        
        it('should return undefined if publicKeys is missing', function() {
            var d_encrypt = new data_encrypt.DataEncrypt();
            assert.equal(undefined, d_encrypt.getOptions('Test-data'));
        });
        
        it('should return options msg if privKeys is not supplied ', function() {
            var d_encrypt = new data_encrypt.DataEncrypt(pubkey);
            var options = d_encrypt.getOptions('Test-data');
            
            assert.equal('Test-data', options.data);
            assert.notEqual(undefined, options.publicKeys)
            assert.equal(undefined, options.privateKeys)
        });
        
        it('should return options if public and private keys are supplied', function() {
            var d_encrypt = new data_encrypt.DataEncrypt(pubkey, 'fake_sec_key');
            var options = d_encrypt.getOptions('Test-data');
            
            assert.equal('Test-data', options.data);
            assert.notEqual(undefined, options.publicKeys)
            assert.notEqual(undefined, options.privateKeys)
        });
    });
});
