//LGSI2023/models/cell.js

const mongoose = require('mongoose');

const cellSchema = new mongoose.Schema({
  row: {type: Number},
  col: {type: Number},
  wine_id: {type: mongoose.Schema.Types.ObjectId, ref:'Wine'}
});

module.exports = mongoose.model('Cell', cellSchema, 'cells');