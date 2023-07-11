//models/pairing.js

var mongoose = require("mongoose");

var pairingSchema = mongoose.Schema({
    name:{type:String, required:true},
});

module.exports = mongoose.model('Pairing', pairingSchema, 'pairings');