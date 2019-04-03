const mongoose = require("mongoose");

const post = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  }
});

const Post = mongoose.model("post", post);

module.exports = Post;
