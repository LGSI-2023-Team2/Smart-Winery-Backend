//LGSI2023/models/cellar.js

const mongoose = require('mongoose');

const floorSchema = new mongoose.Schema({
  type: {
    type: Number,
    default: 0
  },
  temperature_now: {
    type: Number,
    default: 0
  },
  temperature_target: {
    type: Number,
    default: 0
  },
  cell_ids: {
    type: [{type: mongoose.Schema.Types.ObjectId, ref : 'Cell'}]
  },
  is_smart_mode: {
    type: Boolean,
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
  },
  is_reserved: {
    type: Boolean,
    default: false
  },
  reserved_row: {
    type: Number,
    default: 0
  },
  reserved_col: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Cellar', cellarSchema, 'cellars');