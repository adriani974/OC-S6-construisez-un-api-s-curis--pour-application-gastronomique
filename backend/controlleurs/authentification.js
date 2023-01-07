const Authentification = require('../modeles/authentification');
const jwt = require('jsonwebtoken');
const  argon2  = require('argon2');
const email_validator = require('deep-email-validator');

exports.signup = (req, res, next) => {
    const checkEmail = email_validator.validate(req.body.email);

    if(checkEmail){
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
        .catch(error => res.status(500).json({ error }));
    }else{
        res.writeHead(400, {
            "content-type": "application/json",
          });
        res.end();
    }
    
};

exports.login = (req, res, next) => {
    Authentification.findOne({ email: req.body.email })
    .then(authentification => {
        if (!authentification) {
            return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
        }
        argon2.verify(req.body.password, authentification.password)
            .then(valid => {
                if (!valid) {
                    return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                }
                res.status(200).json({
                    userId: authentification._id,
                    token: jwt.sign(
                        { userId: authentification._id },
                        'RANDOM_TOKEN_SECRET',
                        { expiresIn : '24h' }
                    )
                });
            })
            .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};