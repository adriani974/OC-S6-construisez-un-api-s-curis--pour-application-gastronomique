const passwordCheck = require('../modeles/password');

module.exports = (req, res, next) => { 
  console.log("password-check -> password = "+ req.body.password);
    if(passwordCheck.validate(req.body.password)){
            next();
        }else{
            res.writeHead(400,"Le mot de passe doit être composé d'au moins 8 caractères incluant, un minuscule, un majuscule, deux chiffres et aucun espace",
             {
                "content-type": "application/json",
              });
            res.end();
            //res.status(401).json({ error });
        }
 };