require('dotenv').config();

const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

const Drawing = require('./models/drawing');

const app = express();

app.use(express.json());
app.use(cors());

// Ajoutez ceci après l'initialisation de votre app Express
app.use('/model', express.static(path.join(__dirname, '..', 'src', 'model')));


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

  app.get('/model', async (req, res) => {
    console.log("route /model");
    const filePath = path.join(__dirname, '..', 'src', 'model' ,'model.json');
    console.log(filePath)
  
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) {
        console.error('Erreur lors de la lecture du fichier JSON :', err);
        res.status(500).json({ error: 'Erreur lors de la lecture du fichier JSON' });
      } else {
        console.log('done')
        const jsonData = JSON.parse(data);
        res.status(200).json(jsonData);
      }
    });
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
