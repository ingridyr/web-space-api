const bcrypt = require("bcryptjs");
const User = require("../models/user");
const Helpers = require("../utils/helpers");

class UserControllers {
  static async createUser(req, res) {
    // try {
    const { email, username, phone } = req.body;
    if (await User.findOne({ email })) {
      return res.status(409).json({ error: "User email already exists." });
    }
    if (await User.findOne({ username })) {
      return res.status(409).json({ error: "Username already exists." });
    }
    if (await User.findOne({ phone })) {
      return res
        .status(409)
        .json({ error: "User phone number already exists." });
    }

    const userBody = req.body;

    const user = await User.create(userBody);
    user.password = undefined;

    return res
      .status(201)
      .json({ user, token: Helpers.generateToken({ id: user.id }) });
    // } catch (err) {
    //   console.log(err)
    //   return res.status(400).json({
    //     error: err,
    //   });
    // }
  }

  static async readAllUsers(req, res) {
    try {
      const { page, perPage } = req.query;
      const users = await User.find();
      return res.status(200).json(Helpers.paginateData(users, page, perPage));
    } catch (err) {
      return res.status(400).json(err);
    }
  }

  static async readOneUser(req, res) {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.status(200).json(user);
    } catch (err) {
      return res.status(400).json(err);
    }
  }

  static async updateUserInfo(req, res) {
    try {
      const { email, username, bio, phone } = req.body;
      const user = await User.findByIdAndUpdate(req.params.id, {
        email,
        username,
        bio,
        phone,
        updatedAt: Date.now(),
        new: true,
      });
      user.email = email && email;
      user.username = username && username;
      user.bio = bio && bio;
      user.phone = phone && phone;
      return res.status(200).json(user);
    } catch (err) {
      return res.status(400).json(err);
    }
  }

  static async updatePassword(req, res) {
    try {
      const { password } = req.body;
      const user = await User.findByIdAndUpdate(req.params.id, {
        password,
        updatedAt: Date.now(),
        new: true,
      });
      user.password = password && password;
      return res.status(200).json(user);
    } catch (err) {
      return res.status(400).json(err);
    }
  }

  static async updatePhotoUrl(req, res) {
    try {
      const { photoUrl } = req.body;
      const user = await User.findByIdAndUpdate(req.params.id, {
        photoUrl,
        updatedAt: Date.now(),
        new: true,
      });
      user.photoUrl = photoUrl && photoUrl;
      return res.status(200).json(user);
    } catch (err) {
      return res.status(400).json(err);
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      if (!(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: "Invalid password" });
      }
      user.password = undefined;
      return res
        .status(200)
        .json({ user, token: Helpers.generateToken({ id: user.id }) });
    } catch (err) {
      return res.status(400).json(err);
    }
  }
}

module.exports = UserControllers;
