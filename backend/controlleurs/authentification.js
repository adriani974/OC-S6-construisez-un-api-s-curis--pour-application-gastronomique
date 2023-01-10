const Authentification = require('../modeles/authentification');
const jwt = require('jsonwebtoken');
const  argon2  = require('argon2');
const email_validator = require('deep-email-validator');

exports.signup = (req, res, next) => {
    console.log("authentification -> email = "+ req.body.email);
    console.log("authentification -> password = "+ req.body.password);
    const checkEmail = email_validator.validate(req.body.email);

    if(checkEmail){//l'email est valide
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

    }else{//l'email est invalide
        res.writeHead(400, {
            "content-type": "application/json",
          });
        res.end("L'email entré est invalide !");
    }
    
};

exports.login = (req, res, next) => {
    console.log("authentification -> email = "+ req.body.email);
    Authentification.findOne({ email: req.body.email })
    .then((authentification) => {
        if (!authentification) {
            return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
        }
        console.log("authentification -> password = "+ req.body.password);
        console.log("authentification -> auth.password = "+ authentification.password);
        argon2.verify(authentification.password, req.body.password)
            .then((valid) => {
                if (!valid) {
                    return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                }
                res.status(200).json({
                    userId: authentification._id,
                    token: jwt.sign(
                        { userId: authentification._id },
                        process.env.JWT,
                        { expiresIn : '24h' }
                    )
                });
            })
            .catch(error => res.status(502).json({ message: 'Paire login/mot de passe incorrecte'+error }));
    })
    .catch(error => res.status(503).json({ message: 'Paire login/mot de passe incorrecte'+error }));
};