var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var tagsSchema  = new Schema({
    
   'tags'  : Array
    
});

module.exports = mongoose.model('tagsModel', tagsSchema);