var files_to_crypt = [
    {dir:"dir1", files: ["file1", "file2"]},
    {dir:"dir2", files: ["file1", "file2", "file3"]}
];
export.files_to_crypt = files_to_crypt;

var conf = {
    "dropbox_access_token": "YOUR_ACCESS_TOKEN_HERE",
    };
exports.conf = conf;

var pubkey = "your public key";
exports.pubkey = pubkey;

var seckey = "your secret key";
exports.seckey = seckey;

var passphrase = '';
exports.passphrase = passphrase;