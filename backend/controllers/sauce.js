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
        .catch(error => res.status(500).json({ error }));
}

exports.modifySauce =  (req, res, next) => {
  //supprimer l'image de la sauce modifée
  Sauce.findOne({ _id: req.params.id })
  .then(sauce => {
    const filename = sauce.imageUrl.split('/images/')[1];
    fs.unlink(`images/${filename}`, () => {
      const sauceObject = req.file ?// ? = si il existe...
      {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      } : { ...req.body };
    //});

    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
          .catch(error => res.status(500).json({ error }));
    });
  })
  .catch(error => res.status(500).json({ error }));

}

exports.deleteSauce =  (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
        .then(() => {
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

  let like = req.body.like;
  let userId = req.body.userId;


  Sauce.findOne({ _id: req.params.id })
      .then(sauce => {

        let userLiked = sauce.usersLiked;

         if (like === 1 && !userLiked.includes(userId)) {
           // on incrémente le compteur de like
          sauce.likes++;

          // on ajout l'id utilisateur dans usersLike
          userLiked.push(userId);



         }
        else if (like === 0) {
          // on détermine si l'utilisateur a like ou dislike la sauce
          // on décrémente la propriété qui va bien (like/dislike)
          sauce.likes;

          // on supprime du tableau qui va bien (usersLike/usersDislike) l'identifiant du user
          userLiked.remove(userId);

        } else if (like === -1 && !userLiked.includes(userId)) {

          // on incrémente le compteur de dislike
          sauce.likes--;

          // on ajout l'id utilisateur dans usersDislike
          userLiked.push(userId);

        }
        else {
          //error
        }


        //---------------DEBUT A CHOISIR SI ON PREFERE IF/ELSE OU SWITCH/CASE UNE FOIS COMPRIS AVEC LE IF/ELSE
        // switch (like) {
        //   case 1:

        //   break;
        //   case 0:

        //   break;
        //   case -1:

        //   break;
        //   default:
        //     //error => statusCode 401 (bad request)
        // }
        //______________________FIN_A CHOI SIR___________________________//

         sauce.save()
         .then((sauce) => res.status(201).json(sauce))
         .catch(error => res.status(400).json({ error }));
      })


    .catch(error => res.status(500).json({ error }));
};