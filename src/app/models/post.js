const mongoose = require("../../database");

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
  photo: {
    type: Object,
    required: false,
    default: {},
  },
  likes: {
    type: Array,
    required: false,
  },
  dislikes: {
    type: Array,
    required: false,
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