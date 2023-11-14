const mongoose = require('mongoose')

const Schema = mongoose.Schema

const drawingSchema = new Schema({
    drawing: {
      type : String,
      required: true,
    },
    prediction: {
      type: Number,
      required: false
    }
})

module.exports = mongoose.model('Drawings', drawingSchema)