const Sauce = require('../models/sauce');
const fs    = require('fs');
const sauce = require('../models/sauce');
const { request } = require('http');

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
        .catch(error => res.status(400).json({ error }));
}

exports.modifySauce =  (req, res, next) => {
  const sauceObject = req.file ?
  {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
      .catch(error => res.status(400).json({ error }));
}

exports.deleteSauce =  (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
        .then(() => {
          //image
          res.status(200).json({ message: 'Sauce supprimée !'})
        })
        .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
}

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => res.status(200).json(sauce))
      .catch(error => res.status(404).json({ error }));
}

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.status(400).json({ error }));
}



exports.likeDislike = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        let like = request.body.like;
        let userLike = sauce.usersLiked;
        let userId = request.body.userId;

        if (like === 1) {
          // on incrémente le compteur de like
          sauce.likes++;

          // on ajout l'id utilisateur dans usersLike
          userId.push(userLike);

        }
        else if (like === 0) {
          // on détermine si l'utilisateur a like ou dislike la sauce
          // on décrémente la propriété qui va bien (like/dislike)
          // on supprime du tableau qui va bien (usersLike/usersDislike) l'identifiant du user
        } else if (like === -1) {
          // on incrémente le compteur de dislike
          // on ajout l'id utilisateur dans usersDislike
        }
        else {
          //error
        }

        switch (like) {
          case 1:

          break;
          case 0:

          break;
          case -1:

          break;
          default:
            //error => statusCode 401 (bad request)
        }

        switch(true){
          case like === 1:

          break;
          case like === 0:

          break;
        }
      });

    // sauce.save()
    // .then(() => res.status(201).json({ message: 'sauce liké'}))
    // .catch(error => res.status(400).json({ error }));
}