require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')

const app = express()

// connect to db
mongoose.connect(process.env.MONGO_URI)
 .then(() => {
   app.listen(4000, () => {
    console.log('listening on port 4000')
   })
 })
 .catch((error) => {
    console.log(error)
 })


