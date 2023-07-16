const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  id: String,
  title: String,
  content: String,
  file: String,
  userId: String,
  date: { type: Date, default: Date.now }
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
