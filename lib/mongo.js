var mongoose    = require('mongoose');
var config      = require('../config');
var db = mongoose.createConnection(config.mongoUrl);
module.exports.db = db;
