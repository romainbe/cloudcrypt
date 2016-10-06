'use strict'

var decrypt = require('./decrypt');

main();

function main() {
    var decryptor = new decrypt.Decrypt();
    decryptor.getLatestCursorAndPollRemote();
}