var fs = require('fs');
var config = require('./config');

var file_content = fs.readFile(config.conf.fileName, function(err, data) {
    if (err) {
            console.log(err);
            console.log("Cannot read file " + config.conf.fileName);
            return ;
        }
});