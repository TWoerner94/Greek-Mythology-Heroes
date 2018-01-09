var mongoose = require('mongoose');

// SCHEMA / MODEL
var heroSchema = new mongoose.Schema({
   name: String,
   image: String,
   description: String,
   isHalfGod: Boolean
});
module.exports = mongoose.model('Hero', heroSchema);