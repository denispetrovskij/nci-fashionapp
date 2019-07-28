var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    imagePath: {type: String, required: true},
    title: {type: String, required: true},
    color: {type: String, required: true},
    material: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
});

var Product = module.exports = mongoose.model('Product', schema);

module.exports.createProduct = function(newProduct, callback){
    newProduct.save(callback);
};

module.exports.updateProduct = function(updateProduct, callback){
    updateProduct.save(callback);
};

module.exports.getProductById = function(_id, callback) {
    var query = {productId: _id};
    Product.findOne(query,callback);
};

//module.exports = mongoose.model('Product', schema);