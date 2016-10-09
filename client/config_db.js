'use strict'

var user_name = 'romain';

var config = require('./config');
var files_config = require('./FilesConfig')

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/cloudcrypt');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('we are connected!');
    
    var conf = new files_config.FilesConfig(config.files_to_crypt);
    var files = conf.getAllFiles();

    var file_list = [];
    files.forEach((file) => {
        file_list.push({
            fileName: file,
            serverModified: '01/01/1970' 
        });
    });

    var userSchema = mongoose.Schema({
        name: String,
        files: [{
            fileName: String,
            serverModified: {type: Date}
        }]
    });
  
    var user = mongoose.model('Users', userSchema);
    var new_user = new user({
        name: user_name,
        files: file_list
    });
  
    console.log(new_user);
  
    new_user.save((err, user) => {
        if (err) console.log(err);
        else console.log(user_name + ' saved!');
    });
});