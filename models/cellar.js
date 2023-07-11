//LGSI2023/models/cellar.js

const mongoose = require('mongoose');

const floorSchema = new mongoose.Schema({
  type: {
    type: Number,
    required: true
  },
  temperature: {
    type: Number,
    required: true
  },
  wine_ids: {
    type: [{type: mongoose.Schema.Types.ObjectId, ref:'Wine'}],
    required: true
  },
  is_smart_mode: {
    type: Boolean,
    required: true,
    default: true
  }
});

const cellarSchema = new mongoose.Schema({
  floor1: {
    type: floorSchema,
    required: true
  },
  floor2: {
    type: floorSchema,
    required: true
  },
  floor3: {
    type: floorSchema,
    required: true
  }
});

const Cellar = mongoose.model('Cellar', cellarSchema, 'cellars');

module.exports = Cellar;