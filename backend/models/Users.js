const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email: {type: String, required: true, unique:true }, //"unique" pour dire qu'on peut ajouter qu'une seule fois l'adresse mail
    password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);// *

module.exports = mongoose.model('User', userSchema);

// * Dans notre schéma, la valeur unique , avec l'élément mongoose-unique-validator passé comme plug-in, s'assurera qu'aucun des deux utilisateurs ne peut partager la même adresse e-mail