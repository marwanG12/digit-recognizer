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
app.use('/predict', express.static(path.join(__dirname, '..', 'src', 'model')));

// Connexion à la base de données
mongoose.connect(process.env.MONGO_URI, {
  dbName: 'DigitRecognizer',
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connecté à la base de données');
    // Écoute du port
    app.listen(process.env.PORT, () => {
      console.log('Écoute des requêtes sur le port', process.env.PORT);
    });
  })
  .catch((err) => {
    console.error(err);
  });
  

//Route pour communiquer avec l'IA
app.get('/predict', async (req, res) => {
  const filePath = path.join(__dirname, '..', 'src', 'model' ,'model.json');
  console.log(filePath)

  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      console.error('Erreur lors de la lecture du fichier JSON :', err);
      res.status(500).json({ error: 'Erreur lors de la lecture du fichier JSON' });
    } else {
      console.log('Lecture du fichier JSON terminée');
      const jsonData = JSON.parse(data);
      res.status(200).json(jsonData);
    }
  });
});


//Route pour sauvegarder les images
app.post('/save', async (req, res) => {
  try {
    const { pixels, prediction } = req.body;

    const newDrawing = await Drawing.create({ pixels, prediction });

    await newDrawing.save();

    console.log('Dessin enregistré avec succès');
    res.json({ message: 'Dessin enregistré avec succès' });
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement du dessin :', error);
    res.status(500).json({ error: 'Erreur lors de l\'enregistrement du dessin' });
  }
});
