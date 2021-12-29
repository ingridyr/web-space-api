const bcrypt = require("bcryptjs");
const User = require("../models/user");
const Helpers = require("../utils/helpers");
const ProfileImage = require("../models/profileImage");
const FollowList = require("../models/followList");

class UserControllers {
  static async createUser(req, res) {
    try {
      const userBody = req.body;

      const user = await User.create(userBody);
      const followList = await FollowList.create({ user: user.id });
      await User.findByIdAndUpdate(user.id, {
        followList,
        updatedAt: Date.now(),
        new: true,
      });

      user.followList = followList;
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

  static async readFollows(req, res) {
    try {
      const { followListId } = req.params;
      const followList = await FollowList.findById(followListId);
      return res.status(200).json(followList);
    } catch (err) {
      return res.status(400).json(err);
    }
  }

  static async follow(req, res) {
    try {
      const { current, target } = req.params;

      const targetUser = await User.findById(target);
      const currentUser = await User.findById(current);

      const currentFollowList = await FollowList.findById(
        currentUser.followList
      );
      const targetFollowList = await FollowList.findById(targetUser.followList);
      const targetFollowListIds = targetFollowList.followers.map((item) =>
        item._id.toString()
      );

      if (!targetFollowListIds.includes(current)) {
        await FollowList.update(
          { _id: targetUser.followList },
          { $push: { followers: currentUser } },
          { new: true }
        );

        await FollowList.update(
          { _id: currentUser.followList },
          { $push: { following: targetUser } }
        );

        return res
          .status(200)
          .json({
            msg: `${currentUser.username} is following ${targetUser.username}`,
          });
      }

      const removedFromTarget = targetFollowList.followers.filter(
        (item) => item.username !== currentUser.username
      );
      const removedFromCurrent = currentFollowList.following.filter(
        (item) => item.username !== targetUser.username
      );

      await FollowList.findByIdAndUpdate(targetUser.followList, {
        followers: removedFromTarget,
        new: true,
      });

      await FollowList.findByIdAndUpdate(currentUser.followList, {
        following: removedFromCurrent,
        new: true,
      });

      return res
        .status(200)
        .json({
          msg: `${currentUser.username} stopped following ${targetUser.username}`,
        });
    } catch (err) {
      return res.status(400).json(err);
    }
  }
}

module.exports = UserControllers;
