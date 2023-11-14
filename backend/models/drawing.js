const mongoose = require('mongoose')

const Schema = mongoose.Schema

const drawingSchema = new Schema({
  pixels: {
    type: [Number], // Un tableau de valeurs de pixels
    required: true,
  },
  prediction: {
    type: Number,
    required: false,
  }
})

module.exports = mongoose.model('Drawings', drawingSchema)
