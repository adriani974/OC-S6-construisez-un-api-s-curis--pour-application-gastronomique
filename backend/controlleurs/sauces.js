const Sauce = require('../modeles/sauces');
const fs = require('fs');

//Ajoute une nouvelle sauce dans la base de données.
exports.createSauce = (req, res, next) => {
  const sauceObj = JSON.parse(req.body.sauce);
  delete sauceObj._id;
  const sauce = new Sauce({
    ...sauceObj,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
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
  const sauceObject = req.file ? {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };


  delete sauceObject._userId;
  Sauce.findOne({_id: req.params.id})
      .then((sauce) => {
          if (sauce.userId != req.auth.userId) {
              res.status(401).json({ message : 'Non autorisé'});
          } else {
              Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
              .then(() => res.status(200).json({message : 'Objet modifié!'}))
              .catch(error => res.status(401).json({ error }));
          }
      })
      .catch((error) => {
          res.status(400).json({ error });
      });

};

// efface une sauce de la base de donnée
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id})
  .then(sauce => {
      if (sauce.userId != req.auth.userId) {
          res.status(401).json({message: 'Not authorized'});
      } else {
          const filename = sauce.imageUrl.split('/images/')[1];
          fs.unlink(`images/${filename}`, () => {
              Sauce.deleteOne({_id: req.params.id})
                  .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                  .catch(error => res.status(401).json({ error }));
          });
      }
  })
  .catch( error => {
      res.status(500).json({ error });
  });

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

exports.likeSauce = (req, res, next) => {
  const like = req.body.like;
  const userId = req.auth.userId;  
  console.log("sauces -> likeSauce = req.body.userId: "+req.body.userId+" req.auth.userId: "+req.auth.userId); 
  console.log("sauces -> likeSauce = req.body.like: "+req.body.like); 
  if(like === 1){
     
    Sauce.updateOne(
      { _id: req.params.id },
      {
        $inc: { likes: 1 },
        $push: { usersLiked: userId }
      }
    ).then(() => res.status(200).json({ message: "aime" }))
    .catch((error) => res.status(500).json({ error }));

  }else if(like === -1){
   
    Sauce.updateOne(
      { _id: req.params.id },
      {
        $inc: { dislikes: 1 },
        $push: { usersDisliked: userId }
      }
    ).then(() => res.status(200).json({ message: "aime pas" }))
    .catch((error) => res.status(500).json({ error }));

  }else if(like === 0){
    Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if(sauce.usersLiked.includes(userId)){

        Sauce.updateOne(
          { _id: req.params.id },
          {
            $inc: { likes: -1 },
            $pull: { usersLiked: userId }
          }
        ).then(() => res.status(200).json({ message: "utilisateur supprimé" })    
        ).catch((error) => res.status(500).json({ error }));
      }

      if(sauce.usersDisliked.includes(userId)){

        Sauce.updateOne(
          { _id: req.params.id },
          {
            $inc: { dislikes: -1 },
            $pull: { usersDisliked: userId }
          }
        ).then(() => res.status(200).json({ message: "aime pas" })    
        ).catch((error) => res.status(500).json({ error }));
      }


    }).catch((error) => res.status(500).json({ error }));
  }  
}
