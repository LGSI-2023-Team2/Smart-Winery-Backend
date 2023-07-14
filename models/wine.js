//LGSI2023/models/wine.js

var mongoose = require("mongoose");

const aromaCategorySchema = new mongoose.Schema({
  category: {type: String},
  imgsrc: {type: String},
  aroma_names: [{type:String}]
});

const pairingCategorySchema = new mongoose.Schema({
  category: {type: String},
  imgsrc: {type: String},
  pairing_names: [{type:String}]
});

const wineSchema = new mongoose.Schema({
    eng_name: String,
    imgsrc: String,
    price: Number,
    sweet: Number,
    acid: Number,
    body: Number,
    tannin: Number,
    aroma: [{type: aromaCategorySchema}],
    alcohol: String,
    temp: Number,
    type: String,
    pairing: [{type: pairingCategorySchema}],
    barcode: Number
  });

module.exports = mongoose.model('Wine', wineSchema, 'wines');