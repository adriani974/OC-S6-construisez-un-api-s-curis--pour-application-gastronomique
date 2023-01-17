const jwt = require('jsonwebtoken');
//Ce middleware permet de sécuriser les routes afin que seul l'utilisateur authentifier puissent y acceder
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT);
        const userId = decodedToken.userId;
        req.auth = {
          userId: userId
        };
        
        if (req.body.userId && req.body.userId !== userId) {
            console.log("userId n'est pas encore enregistrer");
            throw 'utilisateur n est pas enregistrer';
          } else {
            console.log(" userId est déjà enregistrer");
            next();
          }
   
    } catch(error) {
        res.status(401).json({ error });
        console.log(" erreur, userId est déjà enregistrer");
    }
 };