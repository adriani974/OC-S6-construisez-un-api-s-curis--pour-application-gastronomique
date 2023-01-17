//Importent tous les modules necessaire à l'application.
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const saucesRouter = require('./routes/sauces');
const authentificationRouter = require('./routes/authentification');
const dotenv = require("dotenv");
const sanitize = require('express-mongo-sanitize');
dotenv.config();
const app = express();

/********************************************************************************* */
//mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URL,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

/************************************************************************************* */
app.use(express.json());
app.use(sanitize());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', saucesRouter);
app.use('/api/auth', authentificationRouter);

module.exports = app;