//Importent tous les modules necessaire à l'application.
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const saucesRouter = require('./routes/sauces');
const authentificationRouter = require('./routes/authentification');
const dotenv = require("dotenv");
const sanitize = require('express-mongo-sanitize');
const xssClean = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');

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
//Utile contre les attaques de type brute force, limite le nombre de requête à 50 durant une heure.
const limiter = rateLimit({
  max: 50,
  windowMs: 60 * 60 * 1000,
  message: 'Trop de requêtes pour cette adresse ip, veuillez réessayer dans une heure !',
});

//Limite la taille du fichier json
app.use(express.json({ limit: '5kb' }));
//Utiliser pour contrer les attaque par injection SQL.
app.use(sanitize());
//Utiliser pour contrer les attaque xss.
app.use(xssClean());
//Protection contre les attaques HTTP Parameter Pollution.
app.use(hpp());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use('/api', limiter);
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', saucesRouter);
app.use('/api/auth', authentificationRouter);

module.exports = app;