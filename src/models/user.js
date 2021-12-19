const bcrypt = require("bcryptjs/dist/bcrypt");
const mongoose = require("../database");

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
  },
  birthDate: {
    type: Date,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  photoUrl: {
    type: String,
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
  posts: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "PostSchema",
      required: false,
    },
  ],
  cratedAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  id: {
    type: Number,
    required: true,
    unique: true
  },
});

UserSchema.pre('save', async function(next) {
  const hash = await bcrypt.hash(this.password, 10)
  this.password = hash,
  next();
})

const User = mongoose.model("User", UserSchema);

module.exports = User;
