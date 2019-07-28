var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    clientImagePath: {type: String, required: true},
    productid: {type: String, required: true},
    isApproved: {type: String, default: 'pending'}
    //comment: {type: String, required: true},
});

module.exports = mongoose.model('Client', schema);

module.exports.createClient = function(newClient, callback){
    newClient.save(callback);
};

