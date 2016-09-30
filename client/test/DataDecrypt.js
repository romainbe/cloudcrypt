'use strict'

var assert = require('assert');
var data_decrypt = require('../DataDecrypt');

describe('DataDecrypt', function() {

    var seckey = '-----BEGIN PGP PUBLIC KEY BLOCK-----\n' +
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

    var pgp_msg =
            ['-----BEGIN PGP MESSAGE-----',
            'Version: GnuPG/MacGPG2 v2.0.19 (Darwin)',
            'Comment: GPGTools - http://gpgtools.org',
            '',
            'hIwDBU4Dycfvp2EBA/9tuhQgOrcATcm2PRmIOcs6q947YhlsBTZZdVJDfVjkKlyM',
            'M0yE+lnNplWb041Cpfkkl6IvorKQd2iPbAkOL0IXwmVN41l+PvVgMcuFvvzetehG',
            'Ca0/VEYOaTZRNqyr9FIzcnVy1I/PaWT3iqVAYa+G8TEA5Dh9RLfsx8ZA9UNIaNI+',
            'ASm9aZ3H6FerNhm8RezDY5vRn6xw3o/wH5YEBvV2BEmmFKZ2BlqFQxqChr8UNwd1',
            'Ieebnq0HtBPE8YU/L0U=',
            '=JyIa',
            '-----END PGP MESSAGE-----'].join('\n');

    describe('getOptions', function() {
        it('should return undefined if data length is null', function() {
            var d_decrypt = new data_decrypt.DataDecrypt();
            assert.equal(undefined, d_decrypt.getOptions(''));
        });
        
        it('should return undefined if data is empty', function() {
            var d_decrypt = new data_decrypt.DataDecrypt();
            assert.equal(undefined, d_decrypt.getOptions());
        });
        
        it('should return undefined if privateKeys is missing', function() {
            var d_decrypt = new data_decrypt.DataDecrypt();
            assert.equal(undefined, d_decrypt.getOptions(pgp_msg));
        });
        
        it('should return options msg if publicKeys is not supplied ', function() {
            var d_decrypt = new data_decrypt.DataDecrypt(seckey);
            var options = d_decrypt.getOptions(pgp_msg);
            
            assert.notEqual(0, options.message.length);
            assert.notEqual(undefined, options.privateKey);
            assert.equal(undefined, options.publicKeys);
            assert.equal('binary', options.format);
        });
        
        it('should return options if public and private keys are supplied', function() {
            var d_decrypt = new data_decrypt.DataDecrypt(seckey, '', 'fake_pub_key');
            var options = d_decrypt.getOptions(pgp_msg);
            
            assert.notEqual(0, options.message.length);
            assert.notEqual(undefined, options.publicKeys);
            assert.notEqual(undefined, options.privateKey);
            assert.equal('binary', options.format);
        });
    });
});
