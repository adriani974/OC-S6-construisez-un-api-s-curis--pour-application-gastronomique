const passwordCheck = require('../modeles/password');

module.exports = (req, res, next) => {
    try {
        if(passwordCheck.validate(req.body.password)){
            res.end();
            next();
        }else{
            res.writeHead(400, {
                "content-type": "application/json",
              });
            res.end();
        }
     next();
    } catch(error) {
        res.status(401).json({ error });
    }
 };