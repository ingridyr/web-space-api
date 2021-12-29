const mongoose = require("../../database");

const FollowListSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  pending: {
    type: Array,
    required: false,
  },
  followers: {
    type: Array,
    required: false,
  },
  following: {
    type: Array,
    required: false,
  },
});

module.exports = mongoose.model("FollowList", FollowListSchema);
