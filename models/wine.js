//LGSI2023/models/wine.js

var mongoose = require("mongoose");

const wineSchema = new mongoose.Schema({
    eng_name: String,
    imgsrc: String,
    price: Number,
    sweet: Number,
    acid: Number,
    body: Number,
    tannin: Number,
    aroma: {
      type: Map,
      of: [{type: mongoose.Schema.Types.ObjectId, ref:'Aroma'}],
      default: { 0: [0] }
    },
    alcohol: String,
    temp: Number,
    type: String,
    pairing: {
      type: Map,
      of: [{type: mongoose.Schema.Types.ObjectId, ref:'Pairing'}],
      default: { 0: [0] }
    },
    barcode: Number
  });

module.exports = mongoose.model('Wine', wineSchema, 'wines');