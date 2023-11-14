import Drawing from "./models/drawing"
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

 app.get('/', (req, res) => {
  res.json({mssg: 'Welcome'})
 })

 app.post('/save-drawing', async (req, res) => {
  try {
      const { drawingData } = req.body;
  
      // Créer une nouvelle instance de Drawing avec les données du dessin
      const newDrawing = await Drawing.create({ drawingData })
  
      // Sauvegarder le dessin dans la base de données
      await newDrawing.save();
  
      res.json({ message: 'Dessin enregistré avec succès' });
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du dessin :', error);
      res.status(500).json({ error: 'Erreur lors de l\'enregistrement du dessin' });
    }
})


