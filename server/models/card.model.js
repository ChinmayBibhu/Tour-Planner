const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  text: {
    type: String,
  },
  img: {
    type: String,
  },
  video: {
    type: String,
  },
  userToken: {
    type: String,
    required: true,
  },
});

const Card = mongoose.model('Card', cardSchema);

module.exports = Card;
