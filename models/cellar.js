//LGSI2023/models/cellar.js

const mongoose = require('mongoose');

const floorSchema = new mongoose.Schema({
  type: {
    type: Number,
    required: true
  },
  temperature_now: {
    type: Number,
    required: true
  },
  temperature_target: {
    type: Number,
    required: true
  },
  cell_ids: {
    type: [{type: mongoose.Schema.Types.ObjectId, ref : 'Cell'}]
  },
  is_smart_mode: {
    type: Boolean,
    required: true,
    default: true
  }
});

const cellarSchema = new mongoose.Schema({
  floor1:{
    type: floorSchema,
    required: true
  },
  floor2:{
    type: floorSchema,
    required: true
  },
  floor3:{
    type: floorSchema,
    required: true
  }
});

module.exports = mongoose.model('Cellar', cellarSchema, 'cellars');