const bcrypt = require("bcryptjs");
const User = require("../models/user");
const Helpers = require("../utils/helpers");
const ProfileImage = require("../models/profileImage");

class UserControllers {
  static async createUser(req, res) {
    try {
      const userBody = req.body;

      const user = await User.create(userBody);
      user.password = undefined;

      return res
        .status(201)
        .json({ user, token: Helpers.generateToken({ id: user.id }) });
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        error: err,
      });
    }
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
      const { originalname: name, size, key, location: url = "" } = req.file;
      const userId = req.params.id;

      const user = await User.findById(userId);


      if (user.photo && user.photo.photoId) {
        const imageToRemove = await ProfileImage.findById(user.photo.photoId);
        await imageToRemove.remove();
      }

      const image = await ProfileImage.create({
        name,
        size,
        key,
        url,
        userId,
      });

      const newPhoto = { url: image.url, photoId: image._id };

      const userUpdated = await User.findByIdAndUpdate(userId, {
        photo: newPhoto,
        updatedAt: Date.now(),
        new: true,
      });

      userUpdated.photo = newPhoto;

      return res.json(userUpdated);
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

  static async readFriendList(req, res) {
    try {
      const { page, perPage } = req.query;
      const friends = await User.find();
      return res.status(200).json(Helpers.paginateData(friends, page, perPage));
    } catch (err) {
      return res.status(400).json(err);
    }
  }

  static async updateFriendList(req, res) {
    try {
      const id = req.params.id;
      const friend = await User.findById(id);

      const updatedFriend = await User.findByIdAndUpdate(id, {
        friendList,
        updatedAt: Date.now(),
        new: true,
      });
      updatedFriend.friendList = friend.friendList;

      return res.status(200).json(updatedFriend);
    } catch (err) {
      return res.status(400).json(err);
    }
  }
}

module.exports = UserControllers;
