require('dotenv').config()

const cors = require('cors');

const express = require('express')
const mongoose = require('mongoose')
const Drawing = require('./models/drawing')

const app = express()

app.use(express.json());
app.use(cors());


// connect to db
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('connected to database')
    // listen to port
    app.listen(process.env.PORT, () => {
      console.log('listening for requests on port', process.env.PORT)
    })
  })
  .catch((err) => {
    console.log(err)
  }) 


  app.get('/', async (req, res) => {
    const drawings = await Drawing.find({}).sort({createdAt: -1})

    res.status(200).json(drawings)
   })

  app.post('/save', async (req, res) => {
    try {
        const { drawing } = req.body;
    
        // Créer une nouvelle instance de Drawing avec les données du dessin
        const newDrawing = await Drawing.create({ drawing })
    
        // Sauvegarder le dessin dans la base de données
        await newDrawing.save();
    
        res.json({ message: 'Dessin enregistré avec succès' });

      } catch (error) {

        console.error('Erreur lors de l\'enregistrement du dessin :', error);
        res.status(500).json({ error: 'Erreur lors de l\'enregistrement du dessin' });
      }
  })