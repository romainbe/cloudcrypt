var config = require('./config')
var Dropbox = require('dropbox');

var DropboxConnector = function () {
        this.connector = undefined;
    } 

DropboxConnector.prototype.init = function (token) {
    if (this.connector == undefined) {
        this.connector = new Dropbox({
            accessToken: config.conf.dropbox_access_token 
        });
    }
    return this.connector;
}
  
DropboxConnector.prototype.getFileInfos = function (content, path) {
    if (content == undefined) {
        return undefined;
    } else if (path == undefined) {
        return undefined;
    }
    
    var files_info = {
        contents: content,
        path: path,
        mode: 'overwrite',
        autorename: false,
        mute: false
    };
    
    return files_info;
} 

DropboxConnector.prototype.getDbx = function () {
    return this.connector;
}

exports.DropboxConnector = DropboxConnector;