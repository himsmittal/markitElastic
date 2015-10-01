var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var HistorySchema  = new Schema({
    
   'keywordsSearched'  : Array,
    'linkFound'        : Boolean,
    'time'             : Date,
    'noOfResults'      : Number,
    'publicIp'         : String
    
});

module.exports = mongoose.model('historyModel', HistorySchema);