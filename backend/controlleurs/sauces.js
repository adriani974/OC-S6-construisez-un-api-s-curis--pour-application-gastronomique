const Sauce = require('../modeles/sauces');
const fs = require('fs');

//Ajoute une nouvelle sauce dans la base de données.
exports.createSauce = (req, res, next) => {
  const sauceObj = JSON.parse(req.body.sauce);
  delete sauceObj._id;
  delete sauceObj._userId;
  const sauce = new Sauce({
    userId: sauceObj.userId,
    name: sauceObj.name,
    manufacturer: sauceObj.manufacturer,
    description: sauceObj.description,
    mainPepper: sauceObj.mainPepper,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    heat: sauceObj.heat,
    likes: 0,
    dislikes: 0,
    usersDisliked: [],
    usersLiked: [],
  });
  sauce.save().then(
    () => {
      res.status(201).json({
        message: 'Post saved successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

// récupère une sauce depuis la DB
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

//met à jour une sauce dans la base de donnée
exports.updateSauce = (req, res, next) => {
  const sauce = new Sauce({
    userId: sauceObj.userId,
    name: sauceObj.name,
    manufacturer: sauceObj.manufacturer,
    description: sauceObj.description,
    mainPepper: sauceObj.mainPepper,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    heat: sauceObj.heat,
  });
  Sauce.updateOne({_id: req.params.id}, sauce).then(
    () => {
      res.status(201).json({
        message: 'Thing updated successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

// efface une sauce de la base de donnée
exports.deleteSauce = (req, res, next) => {
  Sauce.deleteOne({_id: req.params.id}).then(
    () => {
      res.status(200).json({
        message: 'Deleted!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

//Renvoient toute les sauces disponible
exports.getAllSauces = (req, res, next) => {
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};