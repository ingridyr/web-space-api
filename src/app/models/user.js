const mongoose = require("../../database");
const bcrypt = require("bcryptjs/dist/bcrypt");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    maxLength: 12,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  bio: {
    type: String,
    required: false,
    maxLength: 180,
    default: "",
  },
  birthDate: {
    type: Date,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  photo: {
    type: Object,
    required: false,
    default: {},
  },
  followers: {
    type: Array,
    required: false,
  },
  following: {
    type: Array,
    required: false,
  },
  posts: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "PostSchema",
      required: false,
    },
  ],
  friendList: {
    type: Array,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: null,
  }
});

UserSchema.pre('save', async function(next) {
  const hash = await bcrypt.hash(this.password, 10)
  this.password = hash,
  next();
})

const User = mongoose.model("User", UserSchema);

module.exports = User;
