const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT);
        const userId = decodedToken.userId;
        if (req.body.userId && req.body.userId !== userId) {
            console.log("userId n'est pas encore enregistrer");
            throw 'Utilisateur non autorisé';
          } else {
            console.log(" userId est déjà enregistrer");
            next();
          }
   
    } catch(error) {
        res.status(401).json({ error });
        console.log(" userId est déjà enregistrer");
    }
 };