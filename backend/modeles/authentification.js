const mongoose = require("mongoose");

const uniqueValidator = require('mongoose-unique-validator');

const authentificationSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  });

authentificationSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Authentification", authentificationSchema); 