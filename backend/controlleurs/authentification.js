const Authentification = require('../modeles/authentification');
const jwt = require('jsonwebtoken');
const  argon2  = require('argon2');
const email_validator = require('email-validator');

//Permet à l'utilisateur de se crée un compte
exports.signup = (req, res, next) => {
    const checkEmail = email_validator.validate(req.body.email);

    if(!checkEmail){//l'email est invalide
        res.writeHead(400, {
            "content-type": "application/json",
          });
        res.end("L'email entré est invalide !");

    }else{//l'email est valide
        argon2.hash(req.body.password)
        .then(hash => {
        const authentification = new Authentification({
            email: req.body.email,
            password: hash
        });
        authentification.save()
            .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
            .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(400).json({ error }));
    }  
};

//Permet à l'utilisateur de se connecter au site
exports.login = (req, res, next) => {
    //recherche dans la table Authentification l'index associer au email
    Authentification.findOne({ email: req.body.email })
    .then((authentification) => {
        if (!authentification) {
            return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
        }
        //Vérifie si le password récuperer dans le champs correspond au password lié au mail
        argon2.verify(authentification.password, req.body.password)
            .then((valid) => {
                if (!valid) {
                    return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                }
                //Si les deux password sont le même, ont authentifie l'utilisateur
                res.status(200).json({
                    userId: authentification._id,
                    token: jwt.sign(
                        { userId: authentification._id },
                        process.env.JWT,
                        { expiresIn : '24h' }
                    )
                });
            })
            .catch(error => res.status(500).json({ message: 'Paire login/mot de passe incorrecte'+error }));
    })
    .catch(error => res.status(500).json({ message: 'Paire login/mot de passe incorrecte'+error }));
};