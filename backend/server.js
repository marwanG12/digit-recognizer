require('dotenv').config();

const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const Drawing = require('./models/drawing');

const app = express();

app.use(express.json());
app.use(cors());

// Connect to the database
mongoose.connect(process.env.MONGO_URI, {
  dbName: 'DigitRecognizer',
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to the database');
    // Listen to port
    app.listen(process.env.PORT, () => {
      console.log('Listening for requests on port', process.env.PORT);
    });
  })
  .catch((err) => {
    console.error(err);
  });

app.get('/', async (req, res) => {
  try {
    const drawings = await Drawing.find({}).sort({ createdAt: -1 });
    res.status(200).json(drawings);
  } catch (error) {
    console.error('Error retrieving drawings:', error);
    res.status(500).json({ error: 'Error retrieving drawings' });
  }
});

app.post('/save', async (req, res) => {
  try {
    const { pixels } = req.body;

    // Create a new instance of Drawing with the pixel data
    const newDrawing = await Drawing.create({ pixels });

    // Save the drawing in the database
    await newDrawing.save();

    res.json({ message: 'Drawing saved successfully' });
  } catch (error) {
    console.error('Error saving the drawing:', error);
    res.status(500).json({ error: 'Error saving the drawing' });
  }
});
