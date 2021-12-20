const mongoose = require("../database");

const PostSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
    maxLength: 64
  },
  description: {
    type: String,
    required: true
  },
  photoUrl: {
    type: String,
    required: false
  },
  likes: {
    type: Number,
    required: false,
    default: 0
  },
  comments: {
    type: Array,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  updatedAt: {
    type: Date,
    default: null
  }

})

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;