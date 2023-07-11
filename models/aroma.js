//models/aroma.js

var mongoose = require("mongoose");

var aromaSchema = mongoose.Schema({
    name:{type:String, required:true}
});

module.exports = mongoose.model('Aroma', aromaSchema, 'aromas');