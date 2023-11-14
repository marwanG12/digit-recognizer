const mongoose = require('mongoose')

const Schema = mongoose.Schema

const drawingSchema = new Schema({
    data: {
      type: String,
      required: true,
    },
})

module.exports = mongoose.model('drawing', drawingSchema)