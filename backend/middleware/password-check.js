const passwordCheck = require('../modeles/password');
//Ce middleware permet de vérifier si le mot de passe crée par l'utilisateur lors de son inscription
//Est un mot de passe forte et donc plus difficile à cracker.
module.exports = (req, res, next) => { 
  
  if(passwordCheck.validate(req.body.password)){
          next();
      }else{
          res.writeHead(400,"Un mot de passe doit être composé d'au moins 8 caractères incluant, un minuscule, un majuscule, un symbole, deux chiffres et aucun espace",
            {
              "content-type": "application/json",
            });
          res.end();
      }
 };